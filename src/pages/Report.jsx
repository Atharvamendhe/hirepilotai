import React from 'react';
import { Trophy, RotateCcw } from 'lucide-react';

export default function Report({ candidate, onRestart }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="glass rounded-3xl p-12 text-center max-w-xl shadow-2xl">
        <div className="p-6 bg-gradient-to-tr from-yellow-500 to-orange-500 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(234,179,8,0.5)]">
          <Trophy className="text-white w-12 h-12" />
        </div>
        
        <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-transparent bg-clip-text">Interview Complete!</h1>
        <p className="text-2xl mb-2">Great job, {candidate.name}!</p>
        <p className="text-gray-400 mb-10">You have finished the mock interview for {candidate.company}.</p>
        
        <button onClick={onRestart} className="mx-auto flex items-center gap-2 px-8 py-4 bg-slate-800 border border-slate-700 hover:border-blue-500 rounded-full font-bold transition-all">
          <RotateCcw size={20} /> Start Over
        </button>
      </div>
    </div>
  );
}
