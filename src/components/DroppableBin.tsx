import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import { Category, CATEGORIES } from '@/data/waste';

interface DroppableBinProps {
  category: Category;
}

const BIN_COLORS: Record<Category, string> = {
  recyclable: 'bg-blue-500',
  organic: 'bg-green-500',
  hazardous: 'bg-red-500',
  general: 'bg-slate-500',
};

const BIN_GLOW: Record<Category, string> = {
  recyclable: 'ring-blue-400 shadow-blue-400/40',
  organic: 'ring-green-400 shadow-green-400/40',
  hazardous: 'ring-red-400 shadow-red-400/40',
  general: 'ring-slate-400 shadow-slate-400/40',
};

export function DroppableBin({ category }: DroppableBinProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: category,
  });

  const binData = CATEGORIES[category];
  const colorClass = BIN_COLORS[category];
  const glowClass = BIN_GLOW[category];

  return (
    <div ref={setNodeRef} className="flex flex-col items-center">
      <motion.div
        animate={{
          scale: isOver ? 1.08 : 1,
          y: isOver ? -8 : 0,
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 22 }}
        className={`
          relative
          w-20 h-28 xs:w-24 xs:h-32 sm:w-28 sm:h-36 md:w-36 md:h-44
          rounded-t-2xl rounded-b-lg shadow-xl border-4 border-black/10
          flex flex-col items-center justify-center gap-1 sm:gap-2
          ${colorClass}
          ${isOver ? `ring-4 ${glowClass} shadow-2xl brightness-110` : ''}
          transition-all duration-200
        `}
      >
        {/* Lid highlight */}
        <div className="absolute top-0 left-0 right-0 h-4 bg-white/20 rounded-t-xl pointer-events-none" />
        
        {/* Vertical grooves for bin texture */}
        <div className="absolute top-10 bottom-3 w-full flex justify-evenly px-3 opacity-20 pointer-events-none">
          <div className="w-1 h-full bg-black/60 rounded-full" />
          <div className="w-1 h-full bg-black/60 rounded-full" />
          <div className="w-1 h-full bg-black/60 rounded-full" />
        </div>

        <span className="text-3xl sm:text-4xl md:text-5xl drop-shadow-md z-10 pointer-events-none">
          {binData.icon}
        </span>
        <span className="text-white font-display font-bold text-xs sm:text-sm md:text-base tracking-wide z-10 text-center leading-tight drop-shadow-md px-1 pointer-events-none">
          {binData.name}
        </span>

        {/* Hover glow overlay */}
        {isOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-white/20 rounded-t-2xl rounded-b-lg pointer-events-none"
          />
        )}
      </motion.div>
    </div>
  );
}
