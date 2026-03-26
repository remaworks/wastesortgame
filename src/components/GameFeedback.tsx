import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GameFeedbackProps {
  feedback: { id: number; type: 'success' | 'error'; points: number } | null;
  onComplete: () => void;
}

export function GameFeedback({ feedback, onComplete }: GameFeedbackProps) {
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(onComplete, 1000);
      return () => clearTimeout(timer);
    }
  }, [feedback, onComplete]);

  return (
    <AnimatePresence>
      {feedback && (
        <motion.div
          key={feedback.id}
          initial={{ opacity: 0, y: 20, scale: 0.5 }}
          animate={{ opacity: 1, y: -50, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 1.2 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50 flex flex-col items-center justify-center`}
        >
          <div className={`text-6xl font-display font-black drop-shadow-xl ${feedback.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
            {feedback.type === 'success' ? '✓' : '❌'}
          </div>
          <div className={`text-4xl font-display font-black text-white text-glow drop-shadow-xl ${feedback.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
            {feedback.points > 0 ? `+${feedback.points}` : feedback.points}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
