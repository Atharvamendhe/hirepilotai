import React, { useState } from 'react';
import { ArrowRight, FileText, Upload, X, Loader2 } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

// IMPORTANT: Setup the PDF worker for Vite to prevent errors
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default function Details({ onStart }) {
  const [form, setForm] = useState({
    name: '',
    company: 'Google',
    role: 'Software Engineer',
    skills: 'React, Node.js',
    resumeText: '', 
  });

  const [isParsing, setIsParsing] = useState(false);
  const [fileName, setFileName] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file.');
      return;
    }

    setIsParsing(true);
    setFileName(file.name);

    try {
      const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
      let fullText = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        fullText += content.items.map(item => item.str).join(' ') + '\n';
      }

      setForm({ ...form, resumeText: fullText });
      alert("Resume uploaded and parsed successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to parse PDF. Please paste your resume text manually.");
      setFileName(null);
    } finally {
      setIsParsing(false);
    }
  };

  const removeFile = () => {
    setFileName(null);
    setForm({ ...form, resumeText: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.resumeText.trim()) {
      alert("Please upload a PDF or type your resume text.");
      return;
    }
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
          <input className="w-full bg-slate-800/50 rounded-xl p-4 border border-slate-700 outline-none focus:border-blue-500" placeholder="Your Name"
            onChange={e => setForm({...form, name: e.target.value})} />

          <select className="w-full bg-slate-800/50 rounded-xl p-4 border border-slate-700 outline-none focus:border-blue-500"
            onChange={e => setForm({...form, company: e.target.value})}>
            <option>Google</option><option>Amazon</option><option>Microsoft</option>
          </select>

          <input className="w-full bg-slate-800/50 rounded-xl p-4 border border-slate-700 outline-none focus:border-blue-500" placeholder="Target Role"
            onChange={e => setForm({...form, role: e.target.value})} />

          <div className="relative">
            {isParsing ? (
              <div className="flex items-center justify-center w-full p-6 border-2 border-dashed border-blue-500 rounded-xl bg-blue-500/10 text-blue-400">
                <Loader2 className="animate-spin mr-2" /> Parsing PDF...
              </div>
            ) : (
              <>
                <label className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-slate-600 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-500/10 transition-all group">
                  <Upload className="w-8 h-8 text-gray-500 group-hover:text-blue-400 mb-2" />
                  <span className="text-gray-400 group-hover:text-blue-300 font-medium">
                    Click to upload Resume PDF
                  </span>
                  <span className="text-xs text-gray-500 mt-1">or drag and drop here</span>
                  <input type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" />
                </label>

                {fileName && (
                  <div className="mt-2 flex items-center justify-between bg-slate-800/50 p-3 rounded-xl border border-green-500/30">
                    <span className="text-green-400 text-sm flex items-center gap-2">
                      <FileText size={16} /> {fileName} - Parsed!
                    </span>
                    <button onClick={removeFile} className="text-red-400 hover:text-red-300">
                      <X size={16} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          <textarea 
            className="w-full bg-slate-800/50 rounded-xl p-4 border border-slate-700 outline-none focus:border-blue-500 h-32 resize-none" 
            placeholder="Or manually paste your resume text here..."
            value={form.resumeText}
            onChange={e => setForm({...form, resumeText: e.target.value})} 
          />

          <button 
            onClick={handleSubmit} 
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold text-lg shadow-lg hover:shadow-blue-500/50 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            Generate Interview <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
