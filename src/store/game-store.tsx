import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WasteItem, Category, WASTE_ITEMS, shuffleArray } from '../data/waste';

type GameStatus = 'idle' | 'playing' | 'finished';

export interface DropResult {
  item: WasteItem;
  binChosen: Category;
  isCorrect: boolean;
}

interface GameContextType {
  playerName: string;
  setPlayerName: (name: string) => void;
  status: GameStatus;
  score: number;
  timeLeft: number;
  gameItems: WasteItem[];
  currentItemIndex: number;
  history: DropResult[];
  startGame: () => void;
  handleDrop: (item: WasteItem, bin: Category) => void;
  endGame: () => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GAME_DURATION = 60; // 60 seconds
export const POINTS_CORRECT = 10;
export const POINTS_WRONG = -5;

export function GameProvider({ children }: { children: ReactNode }) {
  const [playerName, setPlayerName] = useState('');
  const [status, setStatus] = useState<GameStatus>('idle');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameItems, setGameItems] = useState<WasteItem[]>([]);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [history, setHistory] = useState<DropResult[]>([]);

  // Timer logic
  useEffect(() => {
    let timer: number;
    if (status === 'playing' && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && status === 'playing') {
      endGame();
    }
    return () => clearInterval(timer);
  }, [status, timeLeft]);

  const startGame = () => {
    setGameItems(shuffleArray(WASTE_ITEMS));
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setCurrentItemIndex(0);
    setHistory([]);
    setStatus('playing');
  };

  const handleDrop = (item: WasteItem, bin: Category) => {
    const isCorrect = item.category === bin;
    
    // Update score
    setScore((prev) => Math.max(0, prev + (isCorrect ? POINTS_CORRECT : POINTS_WRONG)));
    
    // Record history
    setHistory((prev) => [...prev, { item, binChosen: bin, isCorrect }]);

    // Move to next item or end game
    if (currentItemIndex < gameItems.length - 1) {
      setCurrentItemIndex((prev) => prev + 1);
    } else {
      endGame();
    }
  };

  const endGame = () => {
    setStatus('finished');
  };

  const resetGame = () => {
    setStatus('idle');
    setScore(0);
    setHistory([]);
  };

  return (
    <GameContext.Provider
      value={{
        playerName,
        setPlayerName,
        status,
        score,
        timeLeft,
        gameItems,
        currentItemIndex,
        history,
        startGame,
        handleDrop,
        endGame,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
