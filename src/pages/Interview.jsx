import React, { useState } from 'react';
import Landing from './pages/Landing';
import Details from './pages/Details';
import Interview from './pages/Interview';
import Report from './pages/Report';

export default function App() {
  const [screen, setScreen] = useState('landing'); 
  const [candidate, setCandidate] = useState(null);
  const [evaluationData, setEvaluationData] = useState(null); // NEW: Store the report data

  const startInterview = (data) => {
    setCandidate(data);
    setScreen('interview');
  };

  // NEW: Handle finishing the interview and passing the data
  const handleFinish = (data) => {
    setEvaluationData(data);
    setScreen('report');
  };

  return (
    <div className="min-h-screen">
      {screen === 'landing' && <Landing onStart={() => setScreen('details')} />}
      {screen === 'details' && <Details onStart={startInterview} />}
      {screen === 'interview' && <Interview candidate={candidate} onFinish={handleFinish} />}
      {screen === 'report' && <Report evaluationData={evaluationData} onRestart={() => setScreen('landing')} />}
    </div>
  );
}
