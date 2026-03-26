export type Category = 'recyclable' | 'organic' | 'hazardous' | 'general';

export interface WasteItem {
  id: string;
  name: string;
  emoji: string;
  category: Category;
}

export const CATEGORIES: Record<Category, { name: string; color: string; icon: string }> = {
  recyclable: { name: 'Recyclables', color: 'bg-bin-recyclable', icon: '♻️' },
  organic: { name: 'Organic', color: 'bg-bin-organic', icon: '🌱' },
  hazardous: { name: 'Hazardous', color: 'bg-bin-hazardous', icon: '⚠️' },
  general: { name: 'General', color: 'bg-bin-general', icon: '🗑️' }
};

export const WASTE_ITEMS: WasteItem[] = [
  // Recyclables
  { id: 'r1', name: 'Plastic Bottle', emoji: '🍾', category: 'recyclable' },
  { id: 'r2', name: 'Glass Jar', emoji: '🫙', category: 'recyclable' },
  { id: 'r3', name: 'Newspaper', emoji: '📰', category: 'recyclable' },
  { id: 'r4', name: 'Cardboard Box', emoji: '📦', category: 'recyclable' },
  { id: 'r5', name: 'Aluminum Can', emoji: '🥫', category: 'recyclable' },
  { id: 'r6', name: 'Magazine', emoji: '🗞️', category: 'recyclable' },
  
  // Organic
  { id: 'o1', name: 'Apple Core', emoji: '🍎', category: 'organic' },
  { id: 'o2', name: 'Banana Peel', emoji: '🍌', category: 'organic' },
  { id: 'o3', name: 'Egg Shells', emoji: '🥚', category: 'organic' },
  { id: 'o4', name: 'Coffee Grounds', emoji: '☕', category: 'organic' },
  { id: 'o5', name: 'Vegetable Peel', emoji: '🥔', category: 'organic' },
  { id: 'o6', name: 'Tea Bag', emoji: '🍵', category: 'organic' },
  
  // Hazardous
  { id: 'h1', name: 'Battery', emoji: '🔋', category: 'hazardous' },
  { id: 'h2', name: 'Paint Can', emoji: '🎨', category: 'hazardous' },
  { id: 'h3', name: 'Light Bulb', emoji: '💡', category: 'hazardous' },
  { id: 'h4', name: 'Old Medication', emoji: '💊', category: 'hazardous' },
  { id: 'h5', name: 'Spray Can', emoji: '🧴', category: 'hazardous' },
  { id: 'h6', name: 'Motor Oil', emoji: '🛢️', category: 'hazardous' },
  
  // General
  { id: 'g1', name: 'Dirty Tissue', emoji: '🤧', category: 'general' },
  { id: 'g2', name: 'Broken Ceramic', emoji: '☕', category: 'general' },
  { id: 'g3', name: 'Styrofoam Cup', emoji: '🥤', category: 'general' },
  { id: 'g4', name: 'Chip Bag', emoji: '🍟', category: 'general' },
  { id: 'g5', name: 'Candy Wrapper', emoji: '🍬', category: 'general' },
  { id: 'g6', name: 'Cigarette Butt', emoji: '🚬', category: 'general' },
];

// Helper to shuffle items
export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
