/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/

/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/

/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function seedLmsData() {
  console.log('🌱 Seeding LMS demo data...')
  
  try {
    // Create organization
    const org = await prisma.lmsOrganization.upsert({
      where: { slug: 'elevate' },
      update: {},
      create: {
        name: 'Elevate For Humanity',
        slug: 'elevate',
        domain: 'elevateforhumanity.org'
      }
    })
    console.log('✅ Organization:', org.name)

    // Create demo users (password: "password" for all)
    const hashedPassword = await bcrypt.hash('password', 10)
    
    const admin = await prisma.lmsUser.upsert({
      where: { email: 'admin@elevate.org' },
      update: {},
      create: {
        email: 'admin@elevate.org',
        name: 'Admin User',
        role: 'ADMIN',
        password: hashedPassword,
        orgId: org.id
      }
    })

    const instructor = await prisma.lmsUser.upsert({
      where: { email: 'instructor@elevate.org' },
      update: {},
      create: {
        email: 'instructor@elevate.org',
        name: 'Jane Instructor',
        role: 'INSTRUCTOR',
        password: hashedPassword,
        orgId: org.id
      }
    })

    const student = await prisma.lmsUser.upsert({
      where: { email: 'student@elevate.org' },
      update: {},
      create: {
        email: 'student@elevate.org',
        name: 'John Student',
        role: 'STUDENT',
        password: hashedPassword,
        orgId: org.id
      }
    })

    // Add more demo students
    const student2 = await prisma.lmsUser.upsert({
      where: { email: 'sarah.chen@example.com' },
      update: {},
      create: {
        email: 'sarah.chen@example.com',
        name: 'Sarah Chen',
        role: 'STUDENT',
        password: hashedPassword,
        orgId: org.id
      }
    })

    const student3 = await prisma.lmsUser.upsert({
      where: { email: 'marcus.rodriguez@example.com' },
      update: {},
      create: {
        email: 'marcus.rodriguez@example.com',
        name: 'Marcus Rodriguez',
        role: 'STUDENT',
        password: hashedPassword,
        orgId: org.id
      }
    })

    const student4 = await prisma.lmsUser.upsert({
      where: { email: 'lisa.thompson@example.com' },
      update: {},
      create: {
        email: 'lisa.thompson@example.com',
        name: 'Lisa Thompson',
        role: 'STUDENT',
        password: hashedPassword,
        orgId: org.id
      }
    })
  console.log('✅ Users created: Admin, Instructor, 4 Students')

    // Create courses
    const digitalCourse = await prisma.lmsCourse.upsert({
      where: { slug: 'digital-marketing-mastery' },
      update: { published: true },
      create: {
        title: 'Digital Marketing Mastery',
        slug: 'digital-marketing-mastery',
        price: 29900, // $299
        published: true,
        orgId: org.id
      }
    })

    const aiCourse = await prisma.lmsCourse.upsert({
      where: { slug: 'ai-automation-fundamentals' },
      update: { published: true },
      create: {
        title: 'AI & Automation Fundamentals',
        slug: 'ai-automation-fundamentals',
        price: 49900, // $499
        published: true,
        orgId: org.id
      }
    })

    const freeCourse = await prisma.lmsCourse.upsert({
      where: { slug: 'workforce-readiness' },
      update: { published: true },
      create: {
        title: 'Workforce Readiness Program',
        slug: 'workforce-readiness',
        price: 0, // Free
        published: true,
        orgId: org.id
      }
    })
    console.log('✅ Courses created: Digital Marketing, AI Fundamentals, Workforce Readiness')

    // Create modules and lessons for Digital Marketing course
    const mod1 = await prisma.lmsModule.upsert({
      where: { id: 'mod-digital-1' },
      update: {},
      create: {
        id: 'mod-digital-1',
        title: 'Digital Marketing Foundations',
        order: 1,
        courseId: digitalCourse.id
      }
    })

    const mod2 = await prisma.lmsModule.upsert({
      where: { id: 'mod-digital-2' },
      update: {},
      create: {
        id: 'mod-digital-2',
        title: 'Social Media Strategy',
        order: 2,
        courseId: digitalCourse.id
      }
    })

    // Lessons for Module 1
    await prisma.lmsLesson.upsert({
      where: { id: 'lesson-1-1' },
      update: {},
      create: {
        id: 'lesson-1-1',
        title: 'Introduction to Digital Marketing',
        type: 'VIDEO',
        content: 'Welcome to digital marketing! In this lesson we cover the fundamentals...',
        duration: 900, // 15 minutes
        order: 1,
        moduleId: mod1.id,
        courseId: digitalCourse.id
      }
    })

    await prisma.lmsLesson.upsert({
      where: { id: 'lesson-1-2' },
      update: {},
      create: {
        id: 'lesson-1-2',
        title: 'Understanding Your Target Audience',
        type: 'TEXT',
        content: 'Knowing your audience is crucial for effective marketing campaigns...',
        duration: 600, // 10 minutes
        order: 2,
        moduleId: mod1.id,
        courseId: digitalCourse.id
      }
    })

    // Lessons for Module 2
    await prisma.lmsLesson.upsert({
      where: { id: 'lesson-2-1' },
      update: {},
      create: {
        id: 'lesson-2-1',
        title: 'Facebook Marketing Strategies',
        type: 'VIDEO',
        content: 'Learn how to create effective Facebook marketing campaigns...',
        duration: 1200, // 20 minutes
        order: 1,
        moduleId: mod2.id,
        courseId: digitalCourse.id
      }
    })

    await prisma.lmsLesson.upsert({
      where: { id: 'lesson-2-2' },
      update: {},
      create: {
        id: 'lesson-2-2',
        title: 'Social Media Analytics Quiz',
        type: 'QUIZ',
        content: 'Test your knowledge of social media analytics and metrics...',
        duration: 300, // 5 minutes
        order: 2,
        moduleId: mod2.id,
        courseId: digitalCourse.id
      }
    })

    // Create modules for AI course
    const aiMod1 = await prisma.lmsModule.upsert({
      where: { id: 'mod-ai-1' },
      update: {},
      create: {
        id: 'mod-ai-1',
        title: 'Introduction to AI',
        order: 1,
        courseId: aiCourse.id
      }
    })

    await prisma.lmsLesson.upsert({
      where: { id: 'lesson-ai-1' },
      update: {},
      create: {
        id: 'lesson-ai-1',
        title: 'What is Artificial Intelligence?',
        type: 'VIDEO',
        content: 'An introduction to AI concepts and real-world applications...',
        duration: 1800, // 30 minutes
        order: 1,
        moduleId: aiMod1.id,
        courseId: aiCourse.id
      }
    })

    console.log('✅ Modules and lessons created')

    // Create enrollment for student
    const enrollment = await prisma.lmsEnrollment.upsert({
      where: { 
        userId_courseId: {
          userId: student.id,
          courseId: digitalCourse.id
        }
      },
      update: {},
      create: {
        userId: student.id,
        courseId: digitalCourse.id,
        progress: 0.4,
        status: 'ACTIVE'
      }
    })

    // Enroll student in free course
    await prisma.lmsEnrollment.upsert({
      where: { 
        userId_courseId: {
          userId: student.id,
          courseId: freeCourse.id
        }
      },
      update: {},
      create: {
        userId: student.id,
        courseId: freeCourse.id,
        progress: 1.0,
        status: 'COMPLETED'
      }
    })

    // Enroll Sarah in AI course (active)
    await prisma.lmsEnrollment.upsert({
      where: { 
        userId_courseId: {
          userId: student2.id,
          courseId: aiCourse.id
        }
      },
      update: {},
      create: {
        userId: student2.id,
        courseId: aiCourse.id,
        progress: 0.65,
        status: 'ACTIVE'
      }
    })

    // Enroll Marcus in Digital Marketing (just started)
    await prisma.lmsEnrollment.upsert({
      where: { 
        userId_courseId: {
          userId: student3.id,
          courseId: digitalCourse.id
        }
      },
      update: {},
      create: {
        userId: student3.id,
        courseId: digitalCourse.id,
        progress: 0.15,
        status: 'ACTIVE'
      }
    })

    // Enroll Lisa in multiple courses
    await prisma.lmsEnrollment.upsert({
      where: { 
        userId_courseId: {
          userId: student4.id,
          courseId: freeCourse.id
        }
      },
      update: {},
      create: {
        userId: student4.id,
        courseId: freeCourse.id,
        progress: 1.0,
        status: 'COMPLETED'
      }
    })

    await prisma.lmsEnrollment.upsert({
      where: { 
        userId_courseId: {
          userId: student4.id,
          courseId: digitalCourse.id
        }
      },
      update: {},
      create: {
        userId: student4.id,
        courseId: digitalCourse.id,
        progress: 0.85,
        status: 'ACTIVE'
      }
    })

  console.log('✅ Student enrollments created: 5 total across 4 students')

    const summary = {
      organization: org.slug,
      users: {
        admin: admin.email,
        instructor: instructor.email,
        student: student.email
      },
      courses: [digitalCourse.slug, aiCourse.slug, freeCourse.slug],
      enrollments: 2,
      modules: 3,
      lessons: 5
    }

    console.log('🎉 LMS seed data complete!', summary)
    return summary

  } catch (error) {
    console.error('❌ Seed error:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run directly if called as script
if (import.meta.url === `file://${process.argv[1]}`) {
  seedLmsData()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}