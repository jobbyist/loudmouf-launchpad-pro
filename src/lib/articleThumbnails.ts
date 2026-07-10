/**
 * Article Thumbnail Generator
 * Generates consistent thumbnail designs matching LOUDMOUF™ brand identity
 */

export interface ThumbnailConfig {
  title: string;
  category?: string;
  gradientColors?: string[];
}

export function generateThumbnailStyle(config: ThumbnailConfig): React.CSSProperties {
  const { title, category = 'Culture', gradientColors = ['#FFE047', '#FF6B9D', '#8B5CF6'] } = config;
  
  // Generate consistent gradient based on title hash
  const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colorIndex = hash % gradientColors.length;
  
  return {
    background: `linear-gradient(135deg, ${gradientColors[colorIndex]}, ${gradientColors[(colorIndex + 1) % gradientColors.length]})`,
    position: 'relative',
    overflow: 'hidden',
  };
}

export function getThumbnailPlaceholder(title: string): string {
  // LOUDMOUF™ brand colors
  const colors = ['FFE047', 'FF6B9D', '8B5CF6', '2DD4BF'];
  const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const color1 = colors[hash % colors.length];
  const color2 = colors[(hash + 1) % colors.length];
  
  const initials = title.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&size=800&background=${color1}&color=000&font-size=0.4&bold=true&format=png`;
}
