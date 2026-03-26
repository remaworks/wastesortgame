import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { WasteItem } from '@/data/waste';

interface DraggableItemProps {
  item: WasteItem;
}

export function DraggableItem({ item }: DraggableItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.id,
    data: item,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        touch-none cursor-grab active:cursor-grabbing
        flex flex-col items-center justify-center
        w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48
        bg-white rounded-3xl shadow-xl border-4 border-primary/20
        transition-shadow duration-200
        ${isDragging ? 'shadow-2xl ring-8 ring-primary/30 rotate-3 z-50 opacity-90' : 'hover:-translate-y-2 hover:shadow-2xl'}
      `}
    >
      <span className="text-6xl sm:text-7xl md:text-8xl drop-shadow-lg mb-2 pointer-events-none">
        {item.emoji}
      </span>
      <span className="font-display font-bold text-sm sm:text-base md:text-lg text-foreground text-center px-2 pointer-events-none">
        {item.name}
      </span>
    </div>
  );
}
