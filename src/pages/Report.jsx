import React from 'react';

export default function Report({ candidate, onRestart }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold text-blue-500 mb-8">Interview Complete! 🎉</h1>
      <div className="bg-slate-800 p-10 rounded-3xl shadow-2xl text-center max-w-lg">
        <p className="text-2xl mb-4">Great job, {candidate.name}!</p>
        <p className="text-gray-400 mb-8">You have finished the mock interview for {candidate.company}.</p>
        <button onClick={onRestart} className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-full font-bold">
          Start Over
        </button>
      </div>
    </div>
  );
}