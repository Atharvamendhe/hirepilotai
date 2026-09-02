import React, { useState } from 'react';
import { ArrowRight, FileText, User } from 'lucide-react';

export default function Details({ onStart }) {
  const [form, setForm] = useState({
    name: '', company: 'Google', role: 'Software Engineer', skills: 'React, Node.js', resumeText: 'I have 3 years of experience...'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onStart(form);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="glass rounded-3xl p-10 w-full max-w-lg shadow-2xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-blue-500/20 rounded-xl"><FileText className="text-blue-400 w-6 h-6" /></div>
          <h2 className="text-3xl font-bold">Candidate Details</h2>
        </div>

        <div className="space-y-5">
          <div className="flex items-center gap-3 bg-slate-800/50 rounded-xl p-3 border border-slate-700 focus-within:border-blue-500 transition-colors">
            <User className="text-gray-500 w-5 h-5 ml-2" />
            <input className="w-full bg-transparent outline-none" placeholder="Your Name"
              onChange={e => setForm({...form, name: e.target.value})} />
          </div>

          <select className="w-full bg-slate-800/50 rounded-xl p-4 border border-slate-700 outline-none focus:border-blue-500"
            onChange={e => setForm({...form, company: e.target.value})}>
            <option>Google</option><option>Amazon</option><option>Microsoft</option>
          </select>

          <input className="w-full bg-slate-800/50 rounded-xl p-4 border border-slate-700 outline-none focus:border-blue-500" placeholder="Target Role"
            onChange={e => setForm({...form, role: e.target.value})} />

          <textarea className="w-full bg-slate-800/50 rounded-xl p-4 border border-slate-700 outline-none focus:border-blue-500 h-32 resize-none" placeholder="Paste resume text here..."
            onChange={e => setForm({...form, resumeText: e.target.value})} />

          <button onClick={handleSubmit} className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold text-lg shadow-lg hover:shadow-blue-500/50 transition-all hover:scale-[1.02] flex items-center justify-center gap-2">
            Generate Interview <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
