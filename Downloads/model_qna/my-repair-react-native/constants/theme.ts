// 🎨 EXOTIC THEME SYSTEM - Premium color palettes inspired by luxury tech brands

export const EXOTIC_THEMES = {
  // 🌙 MIDNIGHT OBSIDIAN - Premium dark mode
  dark: {
    name: 'Midnight Obsidian',
    primary: '#6366f1', // Electric violet
    primaryDark: '#4338ca', // Deep violet
    primaryLight: '#8b5cf6', // Light purple
    secondary: '#06b6d4', // Cyan accent
    secondaryDark: '#0891b2', // Deep cyan
    background: '#0a0a0b', // Pure black
    surface: '#1a1a1b', // Dark surface
    surfaceLight: '#2d2d30', // Elevated surface
    text: '#ffffff', // Pure white text
    textSecondary: '#a1a1aa', // Muted text
    textMuted: '#71717a', // Very muted
    accent: '#f59e0b', // Amber accent
    success: '#10b981', // Emerald
    warning: '#f59e0b', // Amber
    error: '#ef4444', // Red
    border: '#374151', // Border color
    borderLight: '#4b5563', // Light border
    shadow: 'rgba(0, 0, 0, 0.8)',
    overlay: 'rgba(0, 0, 0, 0.7)',
    gradientStart: '#1a1a1b',
    gradientEnd: '#0a0a0b',
    cardGradient: ['#1a1a1b', '#2d2d30'],
    glowColor: 'rgba(99, 102, 241, 0.3)',
  },

  // ☀️ ARCTIC WHITE - Premium light mode
  light: {
    name: 'Arctic White',
    primary: '#3b82f6', // Blue
    primaryDark: '#2563eb', // Dark blue
    primaryLight: '#60a5fa', // Light blue
    secondary: '#06b6d4', // Cyan
    secondaryDark: '#0891b2', // Deep cyan
    background: '#ffffff', // Pure white
    surface: '#f8fafc', // Light surface
    surfaceLight: '#f1f5f9', // Elevated surface
    text: '#1e293b', // Dark text
    textSecondary: '#475569', // Muted text
    textMuted: '#94a3b8', // Very muted
    accent: '#f59e0b', // Amber accent
    success: '#10b981', // Emerald
    warning: '#f59e0b', // Amber
    error: '#ef4444', // Red
    border: '#e2e8f0', // Border color
    borderLight: '#cbd5e1', // Light border
    shadow: 'rgba(0, 0, 0, 0.1)',
    overlay: 'rgba(0, 0, 0, 0.3)',
    gradientStart: '#ffffff',
    gradientEnd: '#f8fafc',
    cardGradient: ['#ffffff', '#f8fafc'],
    glowColor: 'rgba(59, 130, 246, 0.2)',
  },

  // 🌊 OCEAN DEPTHS - Premium blue mode
  ocean: {
    name: 'Ocean Depths',
    primary: '#0ea5e9', // Sky blue
    primaryDark: '#0284c7', // Deep sky
    primaryLight: '#38bdf8', // Light sky
    secondary: '#06b6d4', // Cyan
    secondaryDark: '#0891b2', // Deep cyan
    background: '#0c1222', // Deep ocean
    surface: '#1e293b', // Ocean surface
    surfaceLight: '#334155', // Light surface
    text: '#f1f5f9', // Light text
    textSecondary: '#94a3b8', // Muted text
    textMuted: '#64748b', // Very muted
    accent: '#06b6d4', // Cyan accent
    success: '#10b981', // Emerald
    warning: '#f59e0b', // Amber
    error: '#ef4444', // Red
    border: '#475569', // Border
    borderLight: '#64748b', // Light border
    shadow: 'rgba(0, 0, 0, 0.5)',
    overlay: 'rgba(0, 0, 0, 0.6)',
    gradientStart: '#0c1222',
    gradientEnd: '#1e293b',
    cardGradient: ['#1e293b', '#334155'],
    glowColor: 'rgba(14, 165, 233, 0.4)',
  },

  // 🌸 SAKURA DREAMS - Premium pink mode
  sakura: {
    name: 'Sakura Dreams',
    primary: '#ec4899', // Pink
    primaryDark: '#db2777', // Deep pink
    primaryLight: '#f472b6', // Light pink
    secondary: '#8b5cf6', // Purple
    secondaryDark: '#7c3aed', // Deep purple
    background: '#fdf2f8', // Light pink bg
    surface: '#fce7f3', // Pink surface
    surfaceLight: '#fbcfe8', // Elevated surface
    text: '#831843', // Dark pink text
    textSecondary: '#be185d', // Muted pink
    textMuted: '#ec4899', // Light pink
    accent: '#8b5cf6', // Purple accent
    success: '#10b981', // Emerald
    warning: '#f59e0b', // Amber
    error: '#ef4444', // Red
    border: '#f9a8d4', // Pink border
    borderLight: '#fbcfe8', // Light border
    shadow: 'rgba(236, 72, 153, 0.2)',
    overlay: 'rgba(236, 72, 153, 0.1)',
    gradientStart: '#fdf2f8',
    gradientEnd: '#fce7f3',
    cardGradient: ['#fce7f3', '#fbcfe8'],
    glowColor: 'rgba(236, 72, 153, 0.3)',
  },
};

// 🎭 ANIMATION PRESETS
export const ANIMATIONS = {
  spring: {
    damping: 15,
    mass: 1,
    stiffness: 120,
    overshootClamping: false,
    restDisplacementThreshold: 0.001,
    restSpeedThreshold: 0.001,
  },
  gentle: {
    damping: 20,
    mass: 1,
    stiffness: 100,
  },
  bouncy: {
    damping: 10,
    mass: 1,
    stiffness: 150,
  },
  timing: {
    duration: 300,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

// 📐 SPACING & SIZING
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

// 🎨 SHADOWS
export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  glow: {
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 15,
  },
};

export type ThemeName = keyof typeof EXOTIC_THEMES;
export type Theme = typeof EXOTIC_THEMES.dark;
