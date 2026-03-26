import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useGame } from '@/store/game-store';
import { RotateCcw, Share2, CheckCircle2, XCircle, Code } from 'lucide-react';

export default function Results() {
  const [, setLocation] = useLocation();
  const { playerName, score, history, status, resetGame } = useGame();
  const [showEmbed, setShowEmbed] = useState(false);

  useEffect(() => {
    if (status !== 'finished') {
      setLocation('/');
      return;
    }

    const correctCount = history.filter(h => h.isCorrect).length;
    
    // Celebrate if they did reasonably well
    if (correctCount > history.length * 0.5) {
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#22c55e', '#3b82f6', '#f59e0b']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#22c55e', '#3b82f6', '#f59e0b']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [status, setLocation, history]);

  const handlePlayAgain = () => {
    resetGame();
    setLocation('/');
  };

  const correctCount = history.filter(h => h.isCorrect).length;
  const totalItems = history.length;
  
  let message = "Keep learning!";
  if (correctCount > totalItems * 0.8) message = "Waste Sorting Expert! 🏆";
  else if (correctCount > totalItems * 0.5) message = "Great job! 🌟";
  else if (correctCount > totalItems * 0.2) message = "Good effort! 👍";

  const embedCode = `<iframe src="${window.location.origin}" width="100%" height="700px" style="border:none; border-radius: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);"></iframe>`;

  const copyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    alert('Embed code copied to clipboard!');
  };

  if (status !== 'finished') return null;

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-background relative overflow-y-auto">
      <div 
        className="fixed inset-0 z-0 opacity-10 pointer-events-none"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/bg-pattern.png)`, backgroundSize: 'cover' }}
      />

      <div className="max-w-4xl w-full z-10 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-3xl p-6 sm:p-10 flex flex-col items-center"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-muted-foreground mb-2">Game Over, {playerName}!</h2>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-primary mb-2 text-center">
            {message}
          </h1>
          
          <div className="flex flex-col items-center justify-center bg-white/50 w-full rounded-2xl p-6 my-6 border border-border">
            <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">Final Score</span>
            <span className="font-display text-7xl sm:text-8xl font-black text-foreground">{score}</span>
            <div className="flex gap-4 mt-4">
              <div className="flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">
                <CheckCircle2 className="w-5 h-5" /> {correctCount} Correct
              </div>
              <div className="flex items-center gap-1.5 bg-red-100 text-red-700 px-3 py-1 rounded-full font-bold">
                <XCircle className="w-5 h-5" /> {totalItems - correctCount} Missed
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col sm:flex-row gap-4 mb-8">
            <button
              onClick={handlePlayAgain}
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-lg bg-foreground text-background hover:bg-foreground/90 transition-colors shadow-lg"
            >
              <RotateCcw className="w-5 h-5" /> Play Again
            </button>
            <button
              onClick={() => setShowEmbed(!showEmbed)}
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors border border-border shadow-sm"
            >
              <Share2 className="w-5 h-5" /> Embed Game
            </button>
          </div>

          <AnimatePresence>
            {showEmbed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="w-full mb-8 overflow-hidden"
              >
                <div className="bg-slate-900 rounded-2xl p-4 relative group">
                  <div className="flex items-center gap-2 text-slate-400 mb-2 text-sm font-bold uppercase tracking-wider">
                    <Code className="w-4 h-4" /> Embed Code
                  </div>
                  <pre className="text-green-400 font-mono text-sm overflow-x-auto p-2 bg-black/50 rounded-lg">
                    {embedCode}
                  </pre>
                  <button 
                    onClick={copyEmbed}
                    className="mt-3 w-full bg-slate-800 text-white hover:bg-slate-700 py-2 rounded-lg font-medium transition-colors"
                  >
                    Copy to Clipboard
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* History Breakdown */}
          <div className="w-full mt-4">
            <h3 className="font-display text-2xl font-bold mb-4">Your Sorts</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
              {history.map((h, i) => (
                <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border ${h.isCorrect ? 'bg-green-50/50 border-green-200' : 'bg-red-50/50 border-red-200'}`}>
                  <div className="text-3xl">{h.item.emoji}</div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-bold text-foreground truncate">{h.item.name}</span>
                    <span className="text-xs text-muted-foreground truncate">
                      {h.isCorrect ? 
                        `Correctly put in ${h.binChosen}` : 
                        `Put in ${h.binChosen} instead of ${h.item.category}`}
                    </span>
                  </div>
                  {h.isCorrect ? 
                    <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" /> : 
                    <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                  }
                </div>
              ))}
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
