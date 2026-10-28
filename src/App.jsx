import { useEffect, useState } from 'react';
import AuthForm from './views/AuthForm.jsx';
import Blog from './views/Blog.jsx';
import Courses from './views/Courses.jsx';

const email = 'lengwistik.kreyol@gmail.com';

function Header({ user }) {
  return <header className="site-header"><a className="brand" href="/">Lengwistik <span>Kreyòl</span></a><nav aria-label="Navigasyon prensipal"><a href="/#home">Akèy</a><a href="/#about">Apwopo</a><a href="/#courses">Kou</a><a href="/#resources">Resous</a><a href="/blog">Blog</a><a href="/#account">{user ? `Bonjou, ${user.name}` : 'Konekte'}</a></nav></header>;
}

function Footer() { return <footer><p>© 2026 Lengwistik Kreyòl</p><a href={`mailto:${email}`}>{email}</a></footer>; }

export default function App() {
  const [user, setUser] = useState(null); const [checkingSession, setCheckingSession] = useState(true); const blogPage = window.location.pathname === '/blog';
  useEffect(() => { const params = new URLSearchParams(window.location.search); const googleToken = params.get('authToken'); if (googleToken) { localStorage.setItem('authToken', googleToken); window.history.replaceState({}, '', window.location.pathname); } }, []);
  useEffect(() => { const token = localStorage.getItem('authToken'); if (!token) { setCheckingSession(false); return; } fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } }).then(async (response) => { if (!response.ok) throw new Error(); const data = await response.json(); setUser(data.user); }).catch(() => localStorage.removeItem('authToken')).finally(() => setCheckingSession(false)); }, []);
  async function logout() { const token = localStorage.getItem('authToken'); try { await fetch('/api/auth/logout', { method: 'POST', headers: { Authorization: `Bearer ${token}` } }); } finally { localStorage.removeItem('authToken'); setUser(null); } }
  if (blogPage) return <main className="page"><Header user={user} /><Blog /><Footer /></main>;
  return <main className="page"><Header user={user} /><section className="hero" id="home"><div className="hero-copy"><p className="eyebrow">Lang · Kilti · Kominote</p><h1>Dekouvri richès lang kreyòl ayisyen an.</h1><p className="lead">Yon espas akeyan pou aprann sou lang kreyòl, kilti a, ak moun ki fè l vivan chak jou.</p><div className="actions"><a className="button button-primary" href="#courses">Gade kou yo</a><a className="button button-secondary" href="/blog">Li blog la</a></div></div><aside className="hero-card"><p>Sijè vedèt</p><h2>Kisa kreyòl ye?</h2><span>Yon lang ki fèt ak istwa, koneksyon, ak ekspresyon.</span></aside></section><section className="content-section" id="about"><p className="eyebrow">Apwopo nou</p><h2>Lang se yon koneksyon ki vivan.</h2><p>Lengwistik Kreyòl pataje enfòmasyon ak zouti aprantisaj ki fasil pou tout moun ki enterese nan lang kreyòl ayisyen.</p></section><Courses /><section className="resources" id="resources"><article><h3>Aprann</h3><p>Devlope vokabilè ou ak konfyans ou ak leson entwodiksyon ki klè.</p><a href="#courses">Kòmanse aprann →</a></article><article><h3>Dekouvri</h3><p>Eksplore istwa, estrikti, ak itilizasyon lang kreyòl nan lavi chak jou.</p><a href="#account">Dekouvri plis →</a></article><article><h3>Konekte</h3><p>Jwenn yon kominote ki bay lang, kilti, ak konvèsasyon valè.</p><a href="#account">Patisipe →</a></article></section><Blog />{checkingSession ? <section className="signed-in" id="account"><p>Tanpri tann…</p></section> : user ? <section className="signed-in" id="account"><h2>Byenvini, {user.name}.</h2><p>Kont ou pare.</p><button className="button button-secondary" onClick={logout}>Dekonekte</button></section> : <AuthForm onAuthenticated={setUser} />}<Footer /></main>;
}
