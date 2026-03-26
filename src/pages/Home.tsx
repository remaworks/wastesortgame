import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { useGame } from '@/store/game-store';
import { Recycle, Leaf, AlertTriangle, Trash2 } from 'lucide-react';

export default function Home() {
  const [, setLocation] = useLocation();
  const { playerName, setPlayerName, startGame } = useGame();
  const [error, setError] = useState('');

  const handlePlay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) {
      setError('Please enter your name to start!');
      return;
    }
    startGame();
    setLocation('/play');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Image injected via Vite public path */}
      <div 
        className="absolute inset-0 z-0 opacity-10"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/bg-pattern.png)`, backgroundSize: 'cover' }}
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="glass-panel max-w-lg w-full rounded-3xl p-8 sm:p-12 relative z-10 flex flex-col items-center"
      >
        <div className="flex gap-4 mb-6">
          <motion.div animate={{ rotate: [0, -10, 10, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 0 }}><Recycle className="w-10 h-10 text-blue-500" /></motion.div>
          <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}><Leaf className="w-10 h-10 text-green-500" /></motion.div>
          <motion.div animate={{ rotate: [0, -10, 10, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 1 }}><AlertTriangle className="w-10 h-10 text-red-500" /></motion.div>
          <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 1.5 }}><Trash2 className="w-10 h-10 text-slate-500" /></motion.div>
        </div>

        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-center font-bold text-foreground mb-4">
          Waste Sort <span className="text-primary">Hero</span>
        </h1>
        
        <p className="text-muted-foreground text-center mb-8 text-lg">
          Race against the clock to sort waste into the correct bins. Save the planet, one item at a time!
        </p>

        <form onSubmit={handlePlay} className="w-full flex flex-col gap-4">
          <div className="w-full">
            <input
              type="text"
              placeholder="Enter your name..."
              value={playerName}
              onChange={(e) => { setPlayerName(e.target.value); setError(''); }}
              className={`
                w-full px-6 py-4 rounded-2xl font-sans text-lg
                bg-background border-2 
                ${error ? 'border-destructive ring-destructive/20' : 'border-border focus:border-primary focus:ring-primary/20'}
                text-foreground placeholder:text-muted-foreground
                focus:outline-none focus:ring-4
                transition-all duration-200 shadow-inner
              `}
            />
            {error && <p className="text-destructive text-sm mt-2 font-medium px-2">{error}</p>}
          </div>

          <button
            type="submit"
            className="
              w-full py-4 rounded-2xl font-display font-bold text-2xl tracking-wide
              bg-gradient-to-b from-primary to-green-600
              text-primary-foreground shadow-[0_8px_0_0_hsl(142,60%,35%)]
              hover:translate-y-1 hover:shadow-[0_4px_0_0_hsl(142,60%,35%)]
              active:translate-y-2 active:shadow-none
              transition-all duration-150
            "
          >
            PLAY NOW!
          </button>
        </form>

        <div className="mt-8 text-sm text-muted-foreground font-medium text-center">
          Drag and drop items to the correct bin. <br/> 
          <span className="text-green-600">+10 for correct</span> | <span className="text-red-500">-5 for wrong</span>
        </div>
      </motion.div>
    </div>
  );
}
