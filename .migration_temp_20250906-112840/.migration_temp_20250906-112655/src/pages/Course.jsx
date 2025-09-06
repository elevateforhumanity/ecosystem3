export default function Course(){const slug=location.hash.split('/')[2]||'demo-course';return(<main style={{padding:32}}><h1>Course: {slug}</h1><p>Lesson player placeholder</p></main>)}
