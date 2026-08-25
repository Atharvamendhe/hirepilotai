import React from 'react';
import { Bot } from 'lucide-react';

export default function Landing({ onStart }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Bot className="text-blue-500 w-20 h-20 mb-6" />
      <h1 className="text-6xl font-bold mb-4 text-blue-500">HirePilot AI</h1>
      <p className="text-gray-400 text-xl mb-10">Simulate real MNC interviews</p>
      <button 
        onClick={onStart}
        className="px-10 py-4 bg-blue-500 hover:bg-blue-600 rounded-full font-bold text-xl shadow-lg"
      >
        Start Interview
      </button>
    </div>
  );
}