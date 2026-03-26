import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { 
  DndContext, 
  DragEndEvent, 
  MouseSensor, 
  TouchSensor, 
  useSensor, 
  useSensors 
} from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame, POINTS_CORRECT, POINTS_WRONG } from '@/store/game-store';
import { Category } from '@/data/waste';
import { DroppableBin } from '@/components/DroppableBin';
import { DraggableItem } from '@/components/DraggableItem';
import { GameFeedback } from '@/components/GameFeedback';
import { Timer, Star } from 'lucide-react';

export default function Game() {
  const [, setLocation] = useLocation();
  const { 
    status, 
    score, 
    timeLeft, 
    gameItems, 
    currentItemIndex, 
    handleDrop 
  } = useGame();

  const [feedback, setFeedback] = useState<{ id: number; type: 'success' | 'error'; points: number } | null>(null);
  const [feedbackCount, setFeedbackCount] = useState(0);

  useEffect(() => {
    if (status === 'idle') {
      setLocation('/');
    } else if (status === 'finished') {
      setLocation('/results');
    }
  }, [status, setLocation]);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 10 } })
  );

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && over.id) {
      const droppedCategory = over.id as Category;
      const item = active.data.current;
      
      if (item) {
        const isCorrect = item.category === droppedCategory;
        setFeedback({
          id: feedbackCount,
          type: isCorrect ? 'success' : 'error',
          points: isCorrect ? POINTS_CORRECT : POINTS_WRONG
        });
        setFeedbackCount(prev => prev + 1);
        
        handleDrop(item as any, droppedCategory);
      }
    }
  };

  if (status !== 'playing') return null;

  const currentItem = gameItems[currentItemIndex];
  
  const timerColor = timeLeft > 20 ? 'text-primary' : timeLeft > 10 ? 'text-yellow-500' : 'text-destructive';
  const isPulsing = timeLeft <= 10;

  return (
    <DndContext sensors={sensors} onDragEnd={onDragEnd}>
      <div className="min-h-screen w-full flex flex-col relative overflow-hidden bg-background">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/bg-pattern.png)`, backgroundSize: 'cover' }}
        />

        {/* Header HUD */}
        <header className="w-full px-4 pt-4 pb-3 sm:px-6 flex justify-between items-center z-10 glass-panel rounded-b-3xl sticky top-0 shrink-0">
          <div className="flex items-center gap-2 bg-white/50 px-4 py-2 rounded-xl border border-border">
            <Star className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500 fill-yellow-500" />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider leading-none">Score</span>
              <span className="font-display font-black text-2xl sm:text-3xl text-foreground leading-none">{score}</span>
            </div>
          </div>

          <div className={`flex items-center gap-2 px-6 py-2 rounded-xl border-2 ${isPulsing ? 'border-destructive bg-destructive/10 animate-pulse' : 'border-border bg-white/50'}`}>
            <Timer className={`w-6 h-6 sm:w-8 sm:h-8 ${timerColor}`} />
            <span className={`font-display font-black text-3xl sm:text-4xl leading-none w-12 text-center ${timerColor}`}>
              {timeLeft}
            </span>
          </div>
        </header>

        {/* Item Drop Zone — center of screen */}
        <div className="flex-1 flex items-center justify-center z-10 py-4 relative">
          <GameFeedback feedback={feedback} onComplete={() => setFeedback(null)} />
          
          <AnimatePresence mode="wait">
            {currentItem && (
              <motion.div
                key={currentItem.id}
                initial={{ scale: 0, y: -80, rotate: -15 }}
                animate={{ scale: 1, y: 0, rotate: 0 }}
                exit={{ scale: 0, opacity: 0, y: 40 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                className="z-40"
              >
                <DraggableItem item={currentItem} />
              </motion.div>
            )}
          </AnimatePresence>

          {!currentItem && (
            <div className="text-2xl font-display font-bold text-muted-foreground text-center px-8">
              All sorted! ⏳ Waiting for time...
            </div>
          )}
        </div>

        {/* Bins Row — always visible at bottom */}
        <div className="z-10 w-full flex justify-center gap-2 sm:gap-4 md:gap-8 px-2 pb-4 shrink-0">
          <DroppableBin category="recyclable" />
          <DroppableBin category="organic" />
          <DroppableBin category="hazardous" />
          <DroppableBin category="general" />
        </div>
      </div>
    </DndContext>
  );
}
