import { icons } from 'lucide-react';

const Icon = ({ name, color, size, strokeWidth }) => {
  const LucideIcon = icons[name];

  return <LucideIcon color={color} size={size} strokeWidth={strokeWidth} />;
};

export default Icon;