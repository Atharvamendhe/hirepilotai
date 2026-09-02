import React, { useState } from 'react';
import { Mic, Briefcase, Bot, Settings, Loader2, Volume2 } from 'lucide-react';

export default function Interview({ candidate, onFinish }) {
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const [round, setRound] = useState(1);
  const [questionNum, setQuestionNum] = useState(1);
  const totalQuestions = 2;
  
  const [question, setQuestion] = useState("Click the Bot icon at the top left to load the first question!");
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]); // Will now store evaluation data
  const [totalScore, setTotalScore] = useState(0); // NEW: Track total score

  const cleanText = (text) => text.replace(/\*\*/g, '').replace(/\*/g, '');

  const callGemini = async (prompt) => {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No question generated.";
  };

  const startInterview = async () => {
    if (!candidate) return alert("Go back to details!");
    setLoading(true);
    try {
      const q = await callGemini(`You are an interviewer for ${candidate.company} for ${candidate.role}. Ask based on: ${candidate.resumeText}. Output only the question.`);
      setQuestion(cleanText(q));
    } catch (e) { alert(e.message); } finally { setLoading(false); }
  };

  // NEW: Evaluate the answer using strict JSON parsing
  const evaluateAnswer = async (q, a) => {
    const prompt = `You are an expert interviewer. Evaluate the following answer. 
    Question: "${q}"
    Candidate Answer: "${a}"
    
    Return STRICT JSON in this exact format (no markdown, no other text):
    {"score": <int 0-10>, "strengths": ["<string>", "<string>"], "weaknesses": ["<string>", "<string>"], "feedback": "<string>"}`;
    
    const response = await callGemini(prompt);
    try {
      // Remove surrounding ``` if Gemini accidentally adds them
      const cleaned = response.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned);
    } catch (e) {
      // Fallback if JSON parsing fails
      return { score: 5, strengths: ["Couldn't parse"], weaknesses: ["Couldn't parse"], feedback: "Something went wrong in parsing evaluation, but here is raw text: " + response };
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim() || loading) return;
    setLoading(true);
    
    try {
      // 1. Evaluate the answer
      const evalResult = await evaluateAnswer(question, answer);
      
      // 2. Add to total score
      const newTotalScore = totalScore + evalResult.score;
      setTotalScore(newTotalScore);

      // 3. Add to history
      const newHistory = [...history, { question, answer, eval: evalResult }];
      setHistory(newHistory);
      setAnswer('');

      // 4. Move to next question or finish
      if (questionNum < totalQuestions) {
        setQuestionNum(questionNum + 1);
        const q = await callGemini(`Previous Q: "${question}". Candidate answered: "${answer}". Ask the next question. Only output the question.`);
        setQuestion(cleanText(q));
      } else if (round < 3) {
        setRound(round + 1); setQuestionNum(1);
        const q = await callGemini(`Move to HR round. Ask one behavioral question. Only output the question.`);
        setQuestion(cleanText(q));
      } else {
        // All rounds are done. Calculate average and pass data to App.jsx
        const avgScore = (newTotalScore / (totalQuestions * 3)).toFixed(1);
        onFinish({ 
          totalScore: avgScore, 
          finalHistory: newHistory 
        });
      }
    } catch (e) { 
      alert("Error: " + e.message); 
    } finally { 
      setLoading(false); 
    }
  };

  const startVoiceInput = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const r = new SR();
    r.onresult = (e) => setAnswer(e.results[0][0].transcript);
    r.start();
  };

  const speak = () => {
    const u = new SpeechSynthesisUtterance(question);
    window.speechSynthesis.speak(u);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-10 cursor-pointer" onClick={startInterview}>
        <div className="p-3 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl shadow-lg">
          <Bot className="text-white w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold tracking-wide bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">AI Interview Taker</h1>
      </div>

      <div className="w-full max-w-3xl">
        {/* Progress Header */}
        <div className="mb-6 glass rounded-2xl p-4 flex justify-between items-center">
          <div className="flex items-center gap-2 font-semibold text-gray-300">
            <Settings className="w-5 h-5 text-blue-400" />
            <span>Round {round}</span>
          </div>
          <div className="text-gray-400 text-sm">Question {questionNum} of {totalQuestions}</div>
        </div>

        {/* Animated Progress Bar */}
        <div className="w-full h-1.5 bg-slate-800 rounded-full mb-6 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500" style={{ width: `${(questionNum / totalQuestions) * 100}%` }}></div>
        </div>

        {/* Glass Question Card */}
        <div className="glass rounded-3xl p-8 border-l-4 border-blue-500 mb-6 min-h-[180px] flex flex-col justify-center shadow-2xl">
          {loading ? (
            <div className="flex justify-center"><Loader2 className="animate-spin text-blue-500" size={40} /></div>
          ) : (
            <>
              <p className="text-2xl font-medium leading-relaxed">{question}</p>
              <button onClick={speak} className="mt-4 self-start flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm">
                <Volume2 size={16} /> Listen to question
              </button>
            </>
          )}
        </div>

        {/* Answer Box */}
        <div className="glass rounded-3xl mb-6 p-2 focus-within:border-blue-500 transition-all">
          <textarea
            className="w-full h-32 bg-transparent text-lg text-white p-4 resize-none outline-none placeholder-gray-500"
            placeholder="Type your answer or use the mic..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
        </div>

        {/* Futuristic Buttons */}
        <div className="flex gap-4">
          <button onClick={startVoiceInput} className="flex items-center gap-2 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-white font-semibold py-3 px-6 rounded-full transition-all">
            <Mic className="w-5 h-5 text-red-400" /> Speak
          </button>

          <button onClick={submitAnswer} disabled={loading || !answer.trim()} className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 rounded-full shadow-lg hover:shadow-purple-500/50 transition-all disabled:bg-gray-700 disabled:shadow-none">
            <Briefcase className="w-5 h-5" /> Submit Answer
          </button>
        </div>
      </div>
    </div>
  );
}
