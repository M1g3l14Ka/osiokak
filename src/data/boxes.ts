export const BOX_COLORS = [
  'bg-orange-500', 'bg-rose-500', 'bg-amber-500',
  'bg-blue-500', 'bg-emerald-500', 'bg-violet-500',
  'bg-pink-500', 'bg-cyan-500',
];

export const BOX_SIZE_OPTIONS = [
  { label: 'Маленький (500кг)', w: 64, h: 48, weight: 500 },
  { label: 'Средний (1000кг)', w: 88, h: 64, weight: 1000 },
  { label: 'Большой (2000кг)', w: 112, h: 80, weight: 2000 },
  { label: 'Паллета (3000кг)', w: 136, h: 88, weight: 3000 },
];

export function formatKg(n: number): string {
  return n.toLocaleString('ru-RU');
}
