import { icons } from 'lucide-react';

const Icon = ({ name, color, size, strokeWidth, style }) => {
  if (!name) {
    return null;
  }

  const LucideIcon = icons[name];

  return <LucideIcon style={style} color={color} size={size} strokeWidth={strokeWidth} />;
};

export default Icon;