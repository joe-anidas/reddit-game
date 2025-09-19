import { useEffect, useState, useRef } from 'react';
import './styles.css';
import image1 from './images/1.png';
import image2 from './images/2.png';
import runImage from './images/run.png';

type GameState = 'menu' | 'playing' | 'gameOver' | 'leaderboard';
type DollState = 'green' | 'red';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [dollState, setDollState] = useState<DollState>('green');
  const [playerPosition, setPlayerPosition] = useState(0);
  const [timer, setTimer] = useState(30);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [taps, setTaps] = useState(0);
  const [distance, setDistance] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showCaughtAnimation, setShowCaughtAnimation] = useState(false);
  const [dollSpeed, setDollSpeed] = useState(2000);
  const [greenLightDuration, setGreenLightDuration] = useState(1500);
  
  const dollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const getTapsToComplete = (level: number) => {
    if (level <= 4) return level * 5;
    return 20 + (level - 4) * 10;
  };
  const tapsToComplete = getTapsToComplete(level);

  const getLevelTimer = (level: number) => {
    if (level <= 4) return 10 + (level - 1) * 5;
    return 30 + (level - 4) * 10;
  };

  // Audio system - using Web Audio API to generate sounds
  const playSound = (frequency: number, duration: number, type: 'sine' | 'square' = 'sine') => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.type = type;
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (error) {
      console.log('Audio not supported');
    }
  };

  const playGreenLightSound = () => {
    // Pleasant chime - major chord
    playSound(523.25, 0.3); // C5
    setTimeout(() => playSound(659.25, 0.3), 100); // E5
    setTimeout(() => playSound(783.99, 0.4), 200); // G5
  };

  const playRedLightSound = () => {
    // Alarming sound
    playSound(220, 0.2, 'square'); // A3
    setTimeout(() => playSound(196, 0.3, 'square'), 150); // G3
  };

  // Load high score from localStorage on component mount
  useEffect(() => {
    const savedHighScore = localStorage.getItem('redLightGreenLight_highScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

  // Timer effect
  useEffect(() => {
    if (gameState === 'playing') {
      timerIntervalRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setGameState('gameOver');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => {
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
        }
      };
    }
  }, [gameState]);

  // Doll state effect with progressive difficulty
  useEffect(() => {
    if (gameState === 'playing') {
      const cycleDoll = () => {
        const isGreen = Math.random() > 0.5;
        const newState = isGreen ? 'green' : 'red';
        setDollState(newState);
        
        // Play appropriate sound
        if (newState === 'green') {
          playGreenLightSound();
        } else {
          playRedLightSound();
        }
        
        const nextCycleTime = isGreen 
          ? greenLightDuration - (level - 1) * 100  // Green light gets shorter each level
          : Math.random() * 1000 + 500; // Red light duration varies
        
        dollIntervalRef.current = setTimeout(cycleDoll, Math.max(nextCycleTime, 300));
      };
      
      dollIntervalRef.current = setTimeout(cycleDoll, dollSpeed - (level - 1) * 200);
      
      return () => {
        if (dollIntervalRef.current) {
          clearTimeout(dollIntervalRef.current);
        }
      };
    }
  }, [gameState, level, dollSpeed, greenLightDuration]);

  const handleTap = () => {
    if (gameState !== 'playing') {
      return;
    }
    if (dollState === 'red') {
      setShowCaughtAnimation(true);
      setTimeout(() => {
        setGameState('gameOver');
        setShowCaughtAnimation(false);
        // Save high score
        const finalScore = score;
        if (finalScore > highScore) {
          setHighScore(finalScore);
          localStorage.setItem('redLightGreenLight_highScore', finalScore.toString());
        }
      }, 1500);
    } else {
      const moveAmount = 85 / tapsToComplete; // Move towards finish line at 85% of track
      const newPosition = playerPosition + moveAmount;
      setPlayerPosition(newPosition);
      setDistance((prev) => prev + 1);
      
      // Calculate score with level multiplier
      const levelMultiplier = 1 + (level - 1) * 0.1;
      setScore((prev) => prev + Math.floor(levelMultiplier));
      setTaps((prev) => prev + 1);
      
      // Check if player reached the finish line (85% of track)
      if (newPosition >= 85) {
        // Level completed - advance to next level
        setLevel((prev) => prev + 1);
        setTaps(0);
        setTimer(getLevelTimer(level + 1)); // Use new timer logic
        setPlayerPosition(0);
        setDollSpeed(prev => Math.max(prev - 200, 500)); // Faster doll rotation
        setGreenLightDuration(prev => Math.max(prev - 100, 300)); // Shorter green light
      }
    }
  };

  const startGame = () => {
    setGameState('playing');
    setPlayerPosition(0);
    setTimer(getLevelTimer(1)); // Use new timer logic
    setScore(0);
    setLevel(1);
    setTaps(0);
    setDistance(0);
    setDollSpeed(2000);
    setGreenLightDuration(1500);
    setShowCaughtAnimation(false);
  };

  const goToMenu = () => {
    setGameState('menu');
  };

  const showLeaderboard = () => {
    setGameState('leaderboard');
  };


  const shareScore = async () => {
    const shareText = `I scored ${score} points in Red Light, Green Light! Can you beat my score?`;
    
    try {
      // Try Web Share API first (but handle permission errors gracefully)
      if (navigator.share && navigator.canShare && navigator.canShare({ text: shareText })) {
        await navigator.share({
          title: 'Red Light, Green Light - Score',
          text: shareText,
          url: window.location.href,
        });
      } else {
        throw new Error('Web Share not available');
      }
    } catch (error) {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(shareText + ` ${window.location.href}`);
        alert('Score copied to clipboard! 📋');
      } catch (clipboardError) {
        // Final fallback if clipboard also fails
        const textArea = document.createElement('textarea');
        textArea.value = shareText + ` ${window.location.href}`;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Score copied to clipboard! 📋');
      }
    }
  };

  return (
    <div className="game-container">
      {gameState === 'menu' && (
        <div className="menu">
          <h1 className="game-title">Red Light, Green Light</h1>
          <div className="menu-buttons">
            <button className="play-btn" onClick={startGame}>Play</button>
            <button className="leaderboard-btn" onClick={showLeaderboard}>Leaderboard</button>
           
          </div>
          {highScore > 0 && (
            <div className="high-score-display">
              <p>High Score: {highScore}</p>
            </div>
          )}
        </div>
      )}

      {gameState === 'leaderboard' && (
        <div className="leaderboard">
          <div className="squid-symbols">▲ ● ■</div>
          <h2>Leaderboard</h2>
          <div className="leaderboard-list">
            <p>Feature coming soon!</p>
            <p>Your High Score: {highScore}</p>
          </div>
          <button className="back-btn" onClick={goToMenu}>Back to Menu</button>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="game-screen">
          <div className="game-header">
            <div className="timer-bar">
              <div className="timer-fill" style={{ width: `${(timer / getLevelTimer(level)) * 100}%` }}></div>
              <span className="timer-text">Time: {timer}s</span>
            </div>
            <div className="game-stats">
              <span className="level-display">Level: {level}</span>
              <span className="score-display">Score: {score}</span>
              <span className="distance-display">Distance: {distance}m</span>
            </div>
          </div>
          
          <div className="game-field">
            <div className={`doll ${dollState}`}>
              <div className="doll-head">
                <img 
                  src={dollState === 'green' ? image1 : image2} 
                  alt={`Young-hee Doll - ${dollState === 'green' ? 'Green Light' : 'Red Light'}`} 
                  className="doll-image" 
                />
              </div>
              <div className="doll-status">{dollState === 'green' ? 'Green Light' : 'Red Light'}</div>
            </div>
            
            <div className="track">
              <div className="checkpoint finish-line" style={{ top: '5%' }}>
                <span className="checkpoint-text">FINISH</span>
              </div>
              <div className="checkpoint start-line" style={{ bottom: '10%' }}>
                <span className="checkpoint-text">START</span>
              </div>
              <div className="player" style={{ bottom: `${10 + playerPosition}%` }}>
                <img src={runImage} alt="Player Running" className="player-image" />
              </div>
            </div>
            
            {showCaughtAnimation && (
              <div className="caught-animation">
                <h2>CAUGHT!</h2>
                <p>You moved during Red Light!</p>
              </div>
            )}
          </div>
          
          <div className="controls">
            <button 
              className={`tap-button ${dollState}`}
              onClick={handleTap}
              disabled={showCaughtAnimation}
            >
              {dollState === 'green' ? '▶ TAP TO MOVE' : '■ STOP!'}
            </button>
            <div className="progress-indicator">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${(playerPosition / 85) * 100}%` }}
                ></div>
              </div>
              <span className="progress-text">Distance to finish: {Math.round((playerPosition / 85) * 100)}%</span>
            </div>
          </div>
        </div>
      )}

      {gameState === 'gameOver' && (
        <div className="game-over">
          <div className="elimination-symbol">✗</div>
          <h1>ELIMINATED</h1>
          <div className="final-stats">
            <p className="final-score">Score: {score}</p>
            <p className="final-level">Level Reached: {level}</p>
            <p className="final-distance">Distance: {distance}m</p>
            {score === highScore && score > 0 && (
              <p className="new-high-score">★ NEW HIGH SCORE! ★</p>
            )}
            {highScore > 0 && (
              <p className="high-score">High Score: {highScore}</p>
            )}
          </div>
          <div className="game-over-buttons">
            <button className="play-again-btn" onClick={startGame}>Try Again</button>
            <button className="share-btn" onClick={shareScore}>Share Your Score</button>
            <button className="menu-btn" onClick={goToMenu}>Main Menu</button>
          </div>
        </div>
      )}
    </div>
  );
}