import React from 'react';
import { Trophy, RotateCcw, Star, ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';

export default function Report({ evaluationData, onRestart }) {
  // Guard clause if data is missing (e.g., going directly to report page)
  if (!evaluationData) return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <p className="text-gray-400">No interview data found. Please start an interview.</p>
      <button onClick={onRestart} className="mt-4 px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-full font-bold">
          Back to Home
      </button>
    </div>
  );

  const { totalScore, finalHistory } = evaluationData;
  
  // Gather all strengths and weaknesses from the entire interview
  const allStrengths = finalHistory.flatMap(item => item.eval.strengths);
  const allWeaknesses = finalHistory.flatMap(item => item.eval.weaknesses);
  const allFeedback = finalHistory.map((item, idx) => ({
    question: item.question,
    feedback: item.eval.feedback,
    score: item.eval.score
  }));

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="glass rounded-3xl p-10 text-center max-w-3xl w-full shadow-2xl">
        
        <div className="p-6 bg-gradient-to-tr from-yellow-500 to-orange-500 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-[0_0_50px_rgba(234,179,8,0.5)]">
          <Trophy className="text-white w-12 h-12" />
        </div>
        
        <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-transparent bg-clip-text">Interview Complete!</h1>
        <p className="text-gray-400 mb-8">Your performance report is below.</p>

        <div className="mb-8">
          <p className="text-gray-400 uppercase tracking-widest text-sm mb-2">Overall Score</p>
          <p className="text-6xl font-extrabold text-white">{totalScore}<span className="text-2xl text-gray-500">/10</span></p>
        </div>

        {/* Feedback Cards */}
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 mb-8 text-left">
          <h4 className="flex items-center gap-2 text-gray-300 font-bold mb-4">
            <MessageSquare size={20} className="text-blue-400" /> Detailed Feedback
          </h4>
          <div className="space-y-4">
            {allFeedback.map((item, idx) => (
              <div key={idx} className="border-b border-slate-800 pb-4 last:border-0">
                <p className="font-semibold text-white mb-1">Q{idx + 1}: {item.question}</p>
                <p className="text-sm text-gray-400 mb-2">{item.feedback}</p>
                <span className="text-xs font-bold bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">Score: {item.score}/10</span>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths and Weaknesses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-left">
          <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-xl">
            <h4 className="flex items-center gap-2 text-green-400 font-bold mb-3"><ThumbsUp size={18} /> Strengths</h4>
            <ul className="list-disc list-inside text-green-200/80 text-sm space-y-2">
              {allStrengths.map((item, idx) => <li key={idx}>{item}</li>)}
            </ul>
          </div>
          
          <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl">
            <h4 className="flex items-center gap-2 text-red-400 font-bold mb-3"><ThumbsDown size={18} /> Weaknesses</h4>
            <ul className="list-disc list-inside text-red-200/80 text-sm space-y-2">
              {allWeaknesses.map((item, idx) => <li key={idx}>{item}</li>)}
            </ul>
          </div>
        </div>

        <button onClick={onRestart} className="mx-auto flex items-center gap-2 px-8 py-4 bg-slate-800 border border-slate-700 hover:border-blue-500 rounded-full font-bold transition-all">
          <RotateCcw size={20} /> Start Over
        </button>
      </div>
    </div>
  );
}
