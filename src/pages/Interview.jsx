import React, { useState } from 'react';
import { Mic, Briefcase, Bot, Settings, Loader2 } from 'lucide-react';

export default function Interview({ candidate, onFinish }) {
  // NOTE: We fetch this from .env now (VITE_GEMINI_API_KEY)
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  const [round, setRound] = useState(1);
  const [questionNum, setQuestionNum] = useState(1);
  const totalQuestions = 2; // Saves API requests

  const [question, setQuestion] = useState("Click the Bot icon at the top left to load the first question!");
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const cleanText = (text) => text.replace(/\*\*/g, '').replace(/\*/g, '');

  const callGemini = async (prompt) => {
    if (!API_KEY) {
      throw new Error("API Key is missing! Please create a .env file with VITE_GEMINI_API_KEY=your_key");
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No question generated.";
  };

  const startInterview = async () => {
    if (!candidate) {
      alert("Candidate details are missing! Please go back to the Details page.");
      return;
    }
    setLoading(true);
    try {
      const prompt = `You are an interviewer for ${candidate.company} for the role of ${candidate.role}. Ask the first technical interview question based on their resume: ${candidate.resumeText}. Just output the question.`;
      const aiQuestion = await callGemini(prompt);
      setQuestion(cleanText(aiQuestion));
    } catch (error) {
      alert(error.message);
      setQuestion("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim() || loading) return;
    setLoading(true);
    const currentHistory = [...history, { question, answer }];
    setHistory(currentHistory);
    setAnswer('');

    try {
      if (questionNum < totalQuestions) {
        setQuestionNum(questionNum + 1);
        const prompt = `You are an interviewer. The previous question was "${question}". The candidate answered "${answer}". Ask the next technical question. Just output the question.`;
        const aiQuestion = await callGemini(prompt);
        setQuestion(cleanText(aiQuestion));
      } else {
        if (round < 3) {
          setRound(round + 1);
          setQuestionNum(1);
          const prompt = `You are an interviewer. Now move to the HR round. Ask one HR behavioral question. Just output the question.`;
          const aiQuestion = await callGemini(prompt);
          setQuestion(cleanText(aiQuestion));
        } else {
          onFinish();
        }
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.onresult = (event) => setAnswer(event.results[0][0].transcript);
    recognition.start();
  };

  const speakQuestion = () => {
    const utterance = new SpeechSynthesisUtterance(question);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="flex items-center gap-3 mb-10">
        <Bot onClick={startInterview} className="text-blue-500 w-10 h-10 cursor-pointer hover:text-blue-400" />
        <h1 className="text-4xl font-bold text-blue-500 tracking-wide">AI Interview Taker</h1>
      </div>

      <div className="w-full max-w-3xl">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-gray-400 font-semibold">
            <Settings className="w-5 h-5" />
            <span>Round {round}: {round === 1 ? 'Technical' : round === 2 ? 'Technical' : 'HR'}</span>
          </div>
          <div className="text-gray-400">Question {questionNum} of {totalQuestions}</div>
        </div>

        <div className="bg-slate-800 rounded-2xl p-8 shadow-2xl border-l-4 border-blue-500 mb-6 min-h-[160px]">
          {loading ? (
            <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin text-blue-500" size={40} /></div>
          ) : (
            <p className="text-gray-100 text-xl leading-relaxed font-medium">{question}</p>
          )}
        </div>

        <div className="bg-slate-800 rounded-2xl shadow-2xl mb-6">
          <textarea
            className="w-full h-40 bg-transparent text-white p-6 rounded-2xl resize-none outline-none placeholder-gray-500"
            placeholder="Type your answer or click 🎤 to speak..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
        </div>

        <div className="flex gap-4">
          <button onClick={startVoiceInput} className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full">
            <Mic className="w-5 h-5" /> Speak
          </button>
          <button onClick={submitAnswer} disabled={loading || !answer.trim()} className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full disabled:bg-gray-600 disabled:cursor-not-allowed">
            <Briefcase className="w-5 h-5" /> Submit Answer
          </button>
          <button onClick={speakQuestion} className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-8 rounded-full">
            🔊 Read Question
          </button>
        </div>
      </div>
    </div>
  );
}