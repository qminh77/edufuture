
export type LayoutType = 'hero' | 'data-grid' | 'hologram' | 'focus' | 'terminal' | 'interaction';

export interface SlideData {
  id: number;
  title: string;
  subtitle?: string;
  content: string[];
  image?: string;
  layout: LayoutType;
  accent: 'cyan' | 'purple' | 'pink' | 'amber';
  stat?: string; // Optional large statistic for data slides
}
