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
