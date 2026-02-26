/** 主题配置 */
export type Theme = 'light' | 'dark';

export interface ThemeConfig {
  name: Theme;
  colors: {
    background: string;
    surface: string;
    primary: string;
    secondary: string;
    text: string;
    textSecondary: string;
    border: string;
    accent: string;
    success: string;
    error: string;
    warning: string;
    highlight: string;
    highlightRowCol: string;
    fixedCell: string;
    selectedCell: string;
    sameNumber: string;
  };
}

export const themes: Record<Theme, ThemeConfig> = {
  light: {
    name: 'light',
    colors: {
      background: '#f5f0e6',
      surface: '#ffffff',
      primary: '#2563eb',
      secondary: '#7c3aed',
      text: '#1f2937',
      textSecondary: '#6b7280',
      border: '#e5e7eb',
      accent: '#f59e0b',
      success: '#10b981',
      error: '#dc2626',
      warning: '#f59e0b',
      highlight: '#fef3cd',
      highlightRowCol: '#e0f2fe',
      fixedCell: '#f3f4f6',
      selectedCell: '#fef3cd',
      sameNumber: '#dbeafe',
    },
  },
  dark: {
    name: 'dark',
    colors: {
      background: '#0f172a',
      surface: '#1e293b',
      primary: '#60a5fa',
      secondary: '#a78bfa',
      text: '#f1f5f9',
      textSecondary: '#94a3b8',
      border: '#334155',
      accent: '#fbbf24',
      success: '#34d399',
      error: '#f87171',
      warning: '#fbbf24',
      highlight: '#451a03',
      highlightRowCol: '#0c4a6e',
      fixedCell: '#334155',
      selectedCell: '#451a03',
      sameNumber: '#1e3a5f',
    },
  },
};

/** 获取系统主题偏好 */
export function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/** 从本地存储获取主题 */
export function getStoredTheme(): Theme | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('sudoku-theme');
  return stored === 'dark' || stored === 'light' ? stored : null;
}

/** 保存主题到本地存储 */
export function saveTheme(theme: Theme): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('sudoku-theme', theme);
}
