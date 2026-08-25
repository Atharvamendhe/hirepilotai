import React, { useState } from 'react';

export default function Details({ onStart }) {
  const [form, setForm] = useState({
    name: '',
    company: 'Google',
    role: 'Software Engineer',
    skills: 'React, Node.js',
    resumeText: 'I have 3 years of experience building web apps...'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onStart(form);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h2 className="text-4xl font-bold text-blue-500 mb-8">Your Details</h2>
      
      <div className="bg-slate-800 p-8 rounded-2xl w-full max-w-md space-y-4">
        <input className="w-full p-3 bg-slate-700 rounded-lg" placeholder="Your Name" 
          onChange={e => setForm({...form, name: e.target.value})} />

        <select className="w-full p-3 bg-slate-700 rounded-lg" 
          onChange={e => setForm({...form, company: e.target.value})}>
          <option>Google</option>
          <option>Amazon</option>
          <option>Microsoft</option>
        </select>

        <input className="w-full p-3 bg-slate-700 rounded-lg" placeholder="Target Role"
          onChange={e => setForm({...form, role: e.target.value})} />

        <input className="w-full p-3 bg-slate-700 rounded-lg" placeholder="Your Skills (comma separated)"
          onChange={e => setForm({...form, skills: e.target.value})} />

        <textarea className="w-full p-3 bg-slate-700 rounded-lg h-32" placeholder="Paste your resume text here..."
          onChange={e => setForm({...form, resumeText: e.target.value})} />

        <button onClick={handleSubmit} className="w-full py-3 bg-blue-500 hover:bg-blue-600 rounded-xl font-bold">
          Generate Interview
        </button>
      </div>
    </div>
  );
}