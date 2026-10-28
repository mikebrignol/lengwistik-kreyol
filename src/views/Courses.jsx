import { useState } from 'react';

const courses = [
  {
    id: 'individual', number: '01', title: 'Kou endividyèl anliy', label: 'Pèsonalize', price: '116 USD', detail: 'Fòmil sa a fèt pou yon moun ki bezwen yon akonpayman pèsonalize, avèk yon pwogram ki adapte ak nivo li, objektif li ak ritm aprantisaj li.', items: ['2 sesyon · 40 èdtan pou chak sesyon', '80 èdtan pou tout pwogram nan', '116 USD pou chak sesyon 40 èdtan', '232 USD pou tout pwogram 80 èdtan'], note: 'Peman fèt davans pou chak sesyon.',
  },
  {
    id: 'group', number: '02', title: 'Kou anliy an gwoup', label: 'Aprann ansanm', price: '58 USD', detail: 'Fòmil sa a fèt pou gwoup ki vle aprann yon lang ansanm pandan y ap benefisye yon ankadreman pedagojik estriktire.', items: ['Minimòm 10 patisipan', '2 sesyon · 40 èdtan pou chak sesyon', '80 èdtan pou tout pwogram nan', '58 USD pa moun pou chak sesyon', '116 USD pa moun pou tout pwogram nan'], note: 'Gwoup la dwe genyen omwen 10 patisipan.',
  },
  {
    id: 'home', number: '03', title: 'Kou adomisil', label: 'Fas-a-fas', price: '12 USD / èdtan', detail: 'Pou moun ki prefere aprann nan yon kad fizik ak plis pwoksimite. Kou yo òganize selon orè ki dakò ant patisipan an ak fòmatè a.', items: ['Disponib nan Okay / Kanperen', 'Disponib nan Petyonvil ak Dèlma', '12 USD pa èdtan', 'Kantite èdtan ak orè yo detèmine davans'], note: 'Yon fòmil fleksib, ki adapte ak disponiblite w.',
  },
];

const languages = ['Kreyòl ayisyen', 'Fransè', 'Anglè', 'Espanyòl'];
const skills = ['Konpreyansyon oral', 'Ekspresyon oral', 'Konpreyansyon ekri', 'Ekspresyon ekri', 'Vokabilè', 'Gramè', 'Pwononsyasyon', 'Kominikasyon reyèl'];

export default function Courses() {
  const [openCourse, setOpenCourse] = useState('individual');
  return <main className="courses-page" id="courses">
    <section className="courses-hero"><p className="eyebrow">Lengwistik Kreyòl</p><h1>Kou lang anliy<br /><em>ak kou adomisil.</em></h1><p>Aprann yon lang. Pratike l. Sèvi avè l avèk konfyans.</p><a className="button button-primary" href="#reservation">Rezève plas ou</a></section>
    <section className="course-intro"><p>Lengwistik Kreyòl pwopoze kou lang ki fèt pou moun ki vle aprann, amelyore oswa ranfòse konpetans yo nan Kreyòl ayisyen, fransè, anglè ak espanyòl.</p><div><span>Kou yo disponib</span><strong>Anliy · An gwoup · Adomisil</strong></div></section>
    <section className="course-section"><div className="section-title"><p className="eyebrow">Lang disponib</p><h2>Chwazi lang pa w la.</h2></div><div className="language-list">{languages.map((language, index) => <span key={language}><b>0{index + 1}</b>{language}</span>)}</div></section>
    <section className="course-section course-formats"><div className="section-title"><p className="eyebrow">Fòma kou yo</p><h2>Yon fason pou aprann<br />ki mache pou ou.</h2><p>Klike sou yon kat pou wè tout enfòmasyon sou kou a.</p></div><div className="course-cards">{courses.map((course) => { const open = openCourse === course.id; return <article className={`course-card ${open ? 'is-open' : ''}`} key={course.id}><button className="course-trigger" onClick={() => setOpenCourse(open ? '' : course.id)} aria-expanded={open}><span className="course-number">{course.number}</span><span className="course-label">{course.label}</span><h3>{course.title}</h3><span className="course-price">Apati de <b>{course.price}</b></span><span className="course-plus">{open ? '−' : '+'}</span></button>{open && <div className="course-details"><p>{course.detail}</p><ul>{course.items.map((item) => <li key={item}>{item}</li>)}</ul><p className="course-note">{course.note}</p><a href="#reservation">Fè yon rezèvasyon →</a></div>}</article>; })}</div></section>
    <section className="course-section program"><div className="section-title"><p className="eyebrow">Pwogram pedagojik la</p><h2>Yon pwogram ki<br />adapte ak ou.</h2></div><div><p>Kou yo òganize an de sesyon 40 èdtan, pou yon total 80 èdtan. Kontni chak kou adapte ak nivo w, objektif ou, lang ou chwazi a, bezwen kominikatif ou, ak ritm pwogrè ou.</p><div className="skills">{skills.map((skill) => <span key={skill}>{skill}</span>)}</div></div></section>
    <section className="reservation" id="reservation"><p className="eyebrow">Rezèvasyon</p><h2>Pare pou kòmanse?</h2><p>Pou enskri, voye non ou, lang ou vle aprann, nivo ou, fòma ou chwazi a, disponiblite ou, ak enfòmasyon kontak ou.</p><a className="button button-primary" href="mailto:lengwistik.kreyol@gmail.com?subject=Rezèvasyon%20kou">Kontakte nou pou rezève</a><small>Peman fèt davans pou kou anliy endividyèl ak kou an gwoup.</small></section>
    <section className="contact-section" id="contact"><p className="eyebrow">Kontakte nou</p><h2>N ap kontan pale avè w.</h2><div className="contact-list"><a href="tel:+50937860301"><span>Telefòn</span>(509) 3786-0301</a><a href="mailto:lengwistik.kreyol@gmail.com"><span>Imèl</span>lengwistik.kreyol@gmail.com</a><a href="https://instagram.com/lengwistik_kreyol" target="_blank" rel="noreferrer"><span>Instagram</span>@lengwistik_kreyol</a></div></section>
  </main>;
}
