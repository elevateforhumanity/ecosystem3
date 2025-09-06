import { Router } from 'express'
import PDFDocument from 'pdfkit'
import { prisma } from '../lib/prisma.js'
import bcrypt from 'bcryptjs'
import { signToken, requireAuth, requireRole } from '../lib/jwt.js'
const router = Router()

// AUTH
router.post('/auth/signup', async (req,res)=>{
  const {email,password,name,role='STUDENT',orgSlug} = req.body||{}
  if(!email||!password) return res.status(400).json({error:'email/password required'})
  const exists = await prisma.lmsUser.findUnique({where:{email}})
  if(exists) return res.status(400).json({error:'email exists'})
  let org=null
  if(orgSlug){ org = await prisma.lmsOrganization.findUnique({where:{slug:orgSlug}}) }
  const user = await prisma.lmsUser.create({data:{email,name,role,password:await bcrypt.hash(password,10),orgId:org?.id}})
  res.json({id:user.id,email:user.email,role:user.role})
})

router.post('/auth/login', async (req,res)=>{
  const {email,password}=req.body||{}
  const u = await prisma.lmsUser.findUnique({where:{email}})
  if(!u) return res.status(401).json({error:'invalid'})
  const ok = await bcrypt.compare(password,u.password)
  if(!ok) return res.status(401).json({error:'invalid'})
  const token = signToken({uid:u.id,role:u.role,orgId:u.orgId})
  res.json({token,role:u.role})
})

// COURSES
router.get('/courses', async (_req,res)=>{
  try {
    const cs = await prisma.lmsCourse.findMany({ 
      where:{published:true}, 
      select:{id:true,slug:true,title:true,price:true, createdAt:true},
      include: { modules: { orderBy: { order: 'asc' } } }
    })
    res.json(cs)
  } catch (error) {
    res.status(500).json({error: 'Failed to fetch courses'})
  }
})

router.post('/courses', requireAuth, requireRole('INSTRUCTOR'), async (req,res)=>{
  try {
    const {title,slug,price=0,orgSlug} = req.body||{}
    if (!title || !slug) return res.status(400).json({error: 'title and slug required'})
    
    let org=null; if(orgSlug){ org = await prisma.lmsOrganization.findUnique({where:{slug:orgSlug}}) }
    const c = await prisma.lmsCourse.create({data:{title,slug,price,orgId:org?.id}})
    res.json(c)
  } catch (error) {
    if (error.code === 'P2002') {
      res.status(400).json({error: 'Course slug already exists'})
    } else {
      res.status(500).json({error: 'Failed to create course'})
    }
  }
})

router.get('/courses/:courseId', async (req,res)=>{
  try {
    const { courseId } = req.params
    const course = await prisma.lmsCourse.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          orderBy: { order: 'asc' },
          include: { lessons: { orderBy: { order: 'asc' } } }
        },
        lessons: { orderBy: { order: 'asc' } }
      }
    })
    if (!course) return res.status(404).json({error: 'Course not found'})
    res.json(course)
  } catch (error) {
    res.status(500).json({error: 'Failed to fetch course'})
  }
})

// MODULES
router.post('/courses/:courseId/modules', requireAuth, requireRole('INSTRUCTOR'), async (req,res)=>{
  try {
    const { courseId } = req.params
    const { title, order = 0 } = req.body||{}
    if (!title) return res.status(400).json({error: 'title required'})
    
    const module = await prisma.lmsModule.create({
      data: { title, order, courseId }
    })
    res.json(module)
  } catch (error) {
    res.status(500).json({error: 'Failed to create module'})
  }
})

router.post('/modules/:moduleId/lessons', requireAuth, requireRole('INSTRUCTOR'), async (req,res)=>{
  try {
    const { moduleId } = req.params
    const { title, type = 'TEXT', content, duration, order = 0 } = req.body||{}
    if (!title) return res.status(400).json({error: 'title required'})
    
    const module = await prisma.lmsModule.findUnique({ where: { id: moduleId } })
    if (!module) return res.status(404).json({error: 'Module not found'})
    
    const lesson = await prisma.lmsLesson.create({
      data: { title, type, content, duration, order, moduleId, courseId: module.courseId }
    })
    res.json(lesson)
  } catch (error) {
    res.status(500).json({error: 'Failed to create lesson'})
  }
})

// ENROLLMENTS
router.get('/enrollments', requireAuth, async (req,res)=>{
  try {
    const userId = req.user.uid
    const e = await prisma.lmsEnrollment.findMany({ 
      where:{userId}, 
      include:{course:{ include: { modules: true } }}
    })
    res.json(e)
  } catch (error) {
    res.status(500).json({error: 'Failed to fetch enrollments'})
  }
})

router.post('/enrollments', requireAuth, async (req,res)=>{
  try {
    const {courseId} = req.body||{}
    const userId = req.user.uid
    if (!courseId) return res.status(400).json({error: 'courseId required'})
    
    const e = await prisma.lmsEnrollment.create({data:{userId,courseId}})
    res.json(e)
  } catch (error) {
    if (error.code === 'P2002') {
      res.status(400).json({error: 'Already enrolled in this course'})
    } else {
      res.status(500).json({error: 'Failed to enroll'})
    }
  }
})

router.patch('/enrollments/:enrollmentId/progress', requireAuth, async (req,res)=>{
  try {
    const { enrollmentId } = req.params
    const { progress } = req.body||{}
    const userId = req.user.uid
    
    if (progress < 0 || progress > 1) {
      return res.status(400).json({error: 'Progress must be between 0 and 1'})
    }
    
    const enrollment = await prisma.lmsEnrollment.findFirst({
      where: { id: enrollmentId, userId }
    })
    if (!enrollment) return res.status(404).json({error: 'Enrollment not found'})
    
    const updated = await prisma.lmsEnrollment.update({
      where: { id: enrollmentId },
      data: { 
        progress, 
        status: progress >= 1 ? 'COMPLETED' : 'ACTIVE',
        updatedAt: new Date()
      }
    })
    res.json(updated)
  } catch (error) {
    res.status(500).json({error: 'Failed to update progress'})
  }
})

// CERTIFICATES (PDF)
router.get('/certificates/:course.pdf', (req,res)=>{
  const {course}=req.params
  res.setHeader('Content-Type','application/pdf')
  res.setHeader('Content-Disposition',`inline; filename="${course}-certificate.pdf"`)
  const doc=new PDFDocument({size:'LETTER',margin:50})
  doc.pipe(res)
  doc.fontSize(24).text('Certificate of Completion',{align:'center'})
  doc.moveDown().fontSize(18).text(`Awarded to: Demo Student`,{align:'center'})
  doc.moveDown().fontSize(16).text(`For completing: ${course}`,{align:'center'})
  doc.moveDown().fontSize(12).text(`Date: ${new Date().toLocaleDateString()}`,{align:'center'})
  doc.end()
})

// REPORTS
router.get('/reports/summary', async (_req,res)=>{
  const enrollments = await prisma.lmsEnrollment.count()
  const completed = await prisma.lmsEnrollment.count({ where:{status:'COMPLETED'}})
  const courses = await prisma.lmsCourse.count({ where:{published:true}})
  res.json({enrollments,completed,courses})
})

export { router }
