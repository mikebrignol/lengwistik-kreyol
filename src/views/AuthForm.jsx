import { useState } from 'react';

export default function AuthForm({ onAuthenticated }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const registering = mode === 'register';
  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  async function submit(event) {
    event.preventDefault(); setSubmitting(true); setMessage('');
    try {
      const response = await fetch(`/api/auth/${mode}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const contentType = response.headers.get('content-type') || '';
      const data = contentType.includes('application/json') ? await response.json() : null;
      if (!response.ok) throw new Error(data?.message || `Sèvè a pa t bay yon repons valab (kòd ${response.status}).`);
      if (!data?.token || !data?.user) throw new Error('Sèvè a pa t retounen enfòmasyon koneksyon yo. Tanpri verifye API a.');
      localStorage.setItem('authToken', data.token); onAuthenticated(data.user);
    } catch (error) { setMessage(error.message || 'Yon erè rive.'); }
    finally { setSubmitting(false); }
  }

  return <section className="auth-panel" id="account"><div className="auth-card"><p className="eyebrow">Kont ou</p><h2>{registering ? 'Kreye yon kont' : 'Byenvini ankò'}</h2><form onSubmit={submit}>{registering && <label>Non konplè<input name="name" value={form.name} onChange={update} autoComplete="name" required /></label>}<label>Adrès imèl<input type="email" name="email" value={form.email} onChange={update} autoComplete="email" required /></label><label>Modpas<input type="password" name="password" value={form.password} onChange={update} autoComplete={registering ? 'new-password' : 'current-password'} minLength="8" required /></label>{message && <p className="form-message" role="alert">{message}</p>}<button className="button button-primary" disabled={submitting}>{submitting ? 'Tanpri tann…' : registering ? 'Kreye kont' : 'Konekte'}</button></form><p className="switch">{registering ? 'Ou deja gen yon kont?' : 'Ou nouvo nan Lengwistik Kreyòl?'} <button type="button" onClick={() => { setMode(registering ? 'login' : 'register'); setMessage(''); }}>{registering ? 'Konekte' : 'Kreye youn'}</button></p></div></section>;
}
