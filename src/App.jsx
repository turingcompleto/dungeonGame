import React, { useState } from 'react';
import GameInterface from './components/game/GameInterface';
import BootScreen from './components/game/BootScreen';
import './index.css';

function App() {
  const [isBooted, setIsBooted] = useState(false);

  const handleBootComplete = () => {
    setIsBooted(true);
  };

  return (
    <div className="App">
      {!isBooted ? (
        <BootScreen onBootComplete={handleBootComplete} />
      ) : (
        <GameInterface />
      )}
    </div>
  );
}

export default App;