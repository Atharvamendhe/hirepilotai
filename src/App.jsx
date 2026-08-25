import React, { useState } from 'react';
import Landing from './pages/Landing';
import Details from './pages/Details';
import Interview from './pages/Interview';
import Report from './pages/Report';

export default function App() {
  const [screen, setScreen] = useState('landing'); 
  const [candidate, setCandidate] = useState(null);

  const startInterview = (data) => {
    setCandidate(data);
    setScreen('interview');
  };

  return (
    <div className="min-h-screen">
      {screen === 'landing' && <Landing onStart={() => setScreen('details')} />}
      {screen === 'details' && <Details onStart={startInterview} />}
      {screen === 'interview' && <Interview candidate={candidate} onFinish={() => setScreen('report')} />}
      {screen === 'report' && <Report candidate={candidate} onRestart={() => setScreen('landing')} />}
    </div>
  );
}