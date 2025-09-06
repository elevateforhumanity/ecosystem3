#!/usr/bin/env bash
set -euo pipefail

# Detect stack
is_next="false"
if [ -f package.json ] && grep -q '"next"' package.json; then is_next="true"; fi
echo "==> Detected stack: $([ "$is_next" = "true" ] && echo "Next.js" || echo "Vite/React (or other)")"

# Ensure src dirs for React
mkdir -p src/components src/pages src/features

# Add to .env.example
if [ ! -f .env.example ]; then touch .env.example; fi
grep -q '^STRIPE_SECRET_KEY=' .env.example || echo 'STRIPE_SECRET_KEY=CHANGE_ME' >> .env.example
grep -q '^NEXT_PUBLIC_SITE_NAME=' .env.example || echo 'NEXT_PUBLIC_SITE_NAME=Elevate for Humanity LMS' >> .env.example

# --- Common Frontend (both stacks): simple UI pages ---
if [ "$is_next" = "true" ]; then
  mkdir -p pages pages/instructor pages/student pages/analytics pages/courses pages/api/certificates
  # Landing / Catalog
  cat > pages/index.js <<'X'
export default function Home(){return(<main style={{padding:32}}><h1>Elevate for Humanity — LMS</h1><p>Catalog (demo)</p><ul><li><a href="/courses/demo-course">Demo Course</a></li></ul><nav style={{marginTop:16}}><a href="/instructor">Instructor</a> · <a href="/student">Student</a> · <a href="/analytics">Analytics</a></nav></main>)}
X
  # Course page
  mkdir -p pages/courses
  cat > pages/courses/[slug].js <<'X'
import {useRouter} from 'next/router'
export default function Course(){const {query:{slug}}=useRouter();return(<main style={{padding:32}}><h1>Course: {slug}</h1><p>Lesson player (video/text/quiz placeholder)</p></main>)}
X
  # Instructor dashboard + builder
  cat > pages/instructor/index.js <<'X'
export default function Instructor(){return(<main style={{padding:32}}><h1>Instructor Dashboard</h1><a href="/instructor/new-course">+ New Course</a><ul><li>Demo Course — <a href="/instructor/edit/demo-course">Edit</a></li></ul></main>)}
X
  mkdir -p pages/instructor/edit
  cat > pages/instructor/new-course.js <<'X'
export default function NewCourse(){return(<main style={{padding:32}}><h1>New Course</h1><form><input placeholder="Title" /><br/><textarea placeholder="Description"/><br/><button>Create</button></form></main>)}
X
  cat > pages/instructor/edit/[slug].js <<'X'
import {useRouter} from 'next/router'
export default function EditCourse(){const {query:{slug}}=useRouter();return(<main style={{padding:32}}><h1>Edit Course: {slug}</h1><p>Modules/Lessons builder placeholder</p></main>)}
X
  # Student dashboard
  cat > pages/student/index.js <<'X'
export default function Student(){return(<main style={{padding:32}}><h1>Student Dashboard</h1><ul><li>Enrolled: Demo Course — 40% complete</li></ul><a href="/api/certificates/demo-course.pdf" target="_blank">Get Certificate (demo)</a></main>)}
X
  # Analytics
  cat > pages/analytics/index.js <<'X'
export default function Analytics(){return(<main style={{padding:32}}><h1>Analytics</h1><ul><li>Enrollments: 12</li><li>Completions: 7</li><li>Revenue (demo): $3,450</li></ul></main>)}
X
  # Certificates API (PDF)
  cat > pages/api/certificates/[course].js <<'X'
import PDFDocument from 'pdfkit'
export default function handler(req,res){
  const {course}=req.query;
  res.setHeader('Content-Type','application/pdf');
  res.setHeader('Content-Disposition',`inline; filename="${course}-certificate.pdf"`);
  const doc=new PDFDocument({size:'LETTER',margin:50});
  doc.pipe(res);
  doc.fontSize(24).text('Certificate of Completion',{align:'center'});
  doc.moveDown().fontSize(18).text(`Awarded to: Demo Student`,{align:'center'});
  doc.moveDown().fontSize(16).text(`For completing: ${course}`,{align:'center'});
  doc.moveDown().fontSize(12).text(`Date: ${new Date().toLocaleDateString()}`,{align:'center'});
  doc.end();
}
X
else
  # Vite/React: add pages (using simple router-less nav)
  cat > src/pages/Home.jsx <<'X'
export default function Home(){return(<main style={{padding:32}}><h1>Elevate for Humanity — LMS</h1><p>Catalog (demo)</p><ul><li><a href="#" onClick={()=>location.hash='#/course/demo-course'}>Demo Course</a></li></ul><nav style={{marginTop:16}}><a href="#/instructor">Instructor</a> · <a href="#/student">Student</a> · <a href="#/analytics">Analytics</a></nav></main>)}
X
  cat > src/pages/Course.jsx <<'X'
export default function Course(){const slug=location.hash.split('/')[2]||'demo-course';return(<main style={{padding:32}}><h1>Course: {slug}</h1><p>Lesson player placeholder</p></main>)}
X
  cat > src/pages/Instructor.jsx <<'X'
export default function Instructor(){return(<main style={{padding:32}}><h1>Instructor Dashboard</h1><a href="#/instructor/new">+ New Course</a><ul><li>Demo Course — <a href="#/instructor/edit/demo-course">Edit</a></li></ul></main>)}
X
  cat > src/pages/InstructorNew.jsx <<'X'
export default function NewCourse(){return(<main style={{padding:32}}><h1>New Course</h1><form><input placeholder="Title"/><br/><textarea placeholder="Description"/><br/><button>Create</button></form></main>)}
X
  cat > src/pages/InstructorEdit.jsx <<'X'
export default function EditCourse(){const slug=location.hash.split('/')[3]||'demo-course';return(<main style={{padding:32}}><h1>Edit Course: {slug}</h1><p>Modules/Lessons builder placeholder</p></main>)}
X
  cat > src/pages/Student.jsx <<'X'
export default function Student(){return(<main style={{padding:32}}><h1>Student Dashboard</h1><ul><li>Enrolled: Demo Course — 40% complete</li></ul><a href="/api/certificates/demo-course.pdf" target="_blank">Get Certificate (demo)</a></main>)}
X
  cat > src/pages/Analytics.jsx <<'X'
export default function Analytics(){return(<main style={{padding:32}}><h1>Analytics</h1><ul><li>Enrollments: 12</li><li>Completions: 7</li><li>Revenue (demo): $3,450</li></ul></main>)}
X
  # Simple hash-based router in App.jsx (non-destructive if you already have one)
  if [ ! -f src/App.jsx ]; then
    cat > src/App.jsx <<'X'
import Home from './pages/Home.jsx'
import Course from './pages/Course.jsx'
import Instructor from './pages/Instructor.jsx'
import InstructorNew from './pages/InstructorNew.jsx'
import InstructorEdit from './pages/InstructorEdit.jsx'
import Student from './pages/Student.jsx'
import Analytics from './pages/Analytics.jsx'
const route=()=>location.hash.replace('#/','');
export default function App(){
  const r=route();
  if(r.startsWith('course/')) return <Course/>
  if(r==='instructor') return <Instructor/>
  if(r==='instructor/new') return <InstructorNew/>
  if(r.startsWith('instructor/edit/')) return <InstructorEdit/>
  if(r==='student') return <Student/>
  if(r==='analytics') return <Analytics/>
  return <Home/>
}
X
  fi
fi

# --- APIs ---
if [ "$is_next" = "true" ]; then
  # Next.js already added the certificates API. Add simple JSON endpoints.
  cat > pages/api/courses.js <<'X'
export default function handler(_req,res){
  res.status(200).json([{slug:'demo-course',title:'Demo Course',price:99}])
}
X
  cat > pages/api/enrollments.js <<'X'
export default function handler(_req,res){
  res.status(200).json([{user:'demo@student.com',course:'demo-course',progress:0.4}])
}
X
else
  # Express server for Vite/React
  if [ ! -f server.js ]; then
    cat > server.js <<'X'
import express from 'express'
import cors from 'cors'
import path from 'path'
import PDFDocument from 'pdfkit'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
dotenv.config()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const app = express()
app.use(cors())
app.use(express.json())

const courses=[{slug:'demo-course',title:'Demo Course',price:99}]
const enrollments=[{user:'demo@student.com',course:'demo-course',progress:0.4}]

app.get('/api/courses',(req,res)=>res.json(courses))
app.get('/api/enrollments',(req,res)=>res.json(enrollments))
app.get('/api/certificates/:course.pdf',(req,res)=>{
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
// Serve vite build if needed:
// app.use(express.static('dist'))

const PORT=process.env.PORT || 3000
app.listen(PORT,()=>console.log('API listening on',PORT))
X
  fi
fi

# --- Install deps & scripts ---
if [ "$is_next" = "true" ]; then
  echo "==> Installing Next APIs deps: pdfkit"
  npm i -S pdfkit >/dev/null 2>&1 || npm i -S pdfkit
  # Ensure scripts
  node - <<'JS'
const fs=require('fs');const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));
pkg.scripts = pkg.scripts || {};
pkg.scripts.dev = pkg.scripts.dev || "next dev";
pkg.scripts.build = pkg.scripts.build || "next build";
pkg.scripts.start = pkg.scripts.start || "next start -p 3000";
fs.writeFileSync('package.json',JSON.stringify(pkg,null,2));
JS
else
  echo "==> Installing server deps: express cors dotenv pdfkit concurrently"
  npm i -S express cors dotenv pdfkit concurrently >/dev/null 2>&1 || npm i -S express cors dotenv pdfkit concurrently
  # Ensure scripts for Vite + API together
  node - <<'JS'
const fs=require('fs');const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));
pkg.scripts = pkg.scripts || {};
if(!pkg.scripts.dev) pkg.scripts.dev = "vite";
if(!pkg.scripts['dev:api']) pkg.scripts['dev:api'] = "node server.js";
pkg.scripts['dev:all'] = "concurrently -k -n WEB,API \"npm:dev\" \"npm:dev:api\"";
if(!pkg.scripts.build) pkg.scripts.build = "vite build";
if(!pkg.scripts.preview) pkg.scripts.preview = "vite preview --port 4173";
fs.writeFileSync('package.json',JSON.stringify(pkg,null,2));
JS
fi

echo "✅ LMS MVP scaffold added."
echo "Run one of these:"
if [ "$is_next" = "true" ]; then
  echo "  npm run dev   # then open /instructor, /student, /analytics"
else
  echo "  npm run dev:all   # runs Vite UI + Express API together"
  echo "  (open the web preview and try links: #/instructor, #/student, #/analytics)"
fi