import {
    Award,
    Briefcase,
    Building2,
    ChartColumn,
    CircleCheck,
    Database,
    Factory,
    Globe,
    Handshake,
    Headphones,
    Heart,
    type LucideIcon,
    Medal,
    Smile,
    Star,
    Target,
    ThumbsUp,
    TrendingUp,
    Trophy,
    Users,
    Zap,
} from 'lucide-react';
import { createElement } from 'react';

export const ACHIEVEMENT_ICONS = {
    database: Database,
    headphones: Headphones,
    trophy: Trophy,
    smile: Smile,
    users: Users,
    award: Award,
    'building-2': Building2,
    briefcase: Briefcase,
    'circle-check': CircleCheck,
    star: Star,
    heart: Heart,
    'thumbs-up': ThumbsUp,
    target: Target,
    zap: Zap,
    globe: Globe,
    factory: Factory,
    handshake: Handshake,
    medal: Medal,
    'chart-column': ChartColumn,
    'trending-up': TrendingUp,
} as const;

export type AchievementIconName = keyof typeof ACHIEVEMENT_ICONS;

export function achievementIcon(name: string): LucideIcon {
    return ACHIEVEMENT_ICONS[name as AchievementIconName] ?? Database;
}

export function AchievementIcon({
    name,
    className,
    strokeWidth = 1.5,
}: {
    name: string;
    className?: string;
    strokeWidth?: number;
}) {
    return createElement(achievementIcon(name), { className, strokeWidth });
}
