import React from 'react';
import { Bot, Sparkles } from 'lucide-react';

export default function Landing({ onStart }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative">
      {/* Floating Orb */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-purple-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>

      <div className="z-10 text-center">
        <div className="glass inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-semibold text-blue-300">
          <Sparkles size={16} /> Powered by Google Gemini
        </div>

        <div className="flex justify-center mb-6">
          <div className="p-6 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-3xl shadow-[0_0_40px_rgba(59,130,246,0.5)]">
            <Bot className="text-white w-16 h-16" />
          </div>
        </div>

        <h1 className="text-7xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
          HirePilot AI
        </h1>
        <p className="text-xl text-gray-400 mb-10 font-light max-w-lg mx-auto">
          Simulate real MNC interviews with an AI that speaks, listens, and evaluates you.
        </p>

        <button
          onClick={onStart}
          className="group relative px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-bold text-lg shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:shadow-[0_0_50px_rgba(59,130,246,0.8)] hover:scale-105 transition-all duration-300 flex items-center gap-2 mx-auto"
        >
          Start Interview
        </button>
      </div>
    </div>
  );
}
