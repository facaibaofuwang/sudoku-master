/** 本地存储管理 - 统计数据、成就、游戏状态 */

export type Difficulty = 'easy' | 'medium' | 'hard' | 'daily';

export interface GameStats {
  totalGames: number;
  totalWins: number;
  totalLosses: number;
  currentStreak: number;
  bestStreak: number;
  totalPlayTime: number; // 秒
  bestTimes: Record<Difficulty, number | null>;
  totalScore: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string | null;
  condition: (stats: GameStats) => boolean;
}

export interface DailyChallenge {
  date: string; // YYYY-MM-DD
  seed: number;
  difficulty: Difficulty;
  completed: boolean;
  completedAt: string | null;
  time: number | null;
  score: number | null;
}

export interface GameState {
  grid: number[][];
  solution: number[][];
  fixedCells: boolean[][];
  notes: number[][][];
  difficulty: Difficulty;
  gameTime: number;
  hintCount: number;
  errorCount: number;
  score: number;
  startedAt: string;
}

const STORAGE_KEYS = {
  stats: 'sudoku-stats',
  achievements: 'sudoku-achievements',
  daily: 'sudoku-daily',
  gameState: 'sudoku-game-state',
  lastPlayed: 'sudoku-last-played',
};

// 成就定义
export const ACHIEVEMENTS: Omit<Achievement, 'unlockedAt'>[] = [
  {
    id: 'first_win',
    name: '初出茅庐',
    description: '完成第一局游戏',
    icon: '🎉',
    condition: (s) => s.totalWins >= 1,
  },
  {
    id: 'win_10',
    name: '渐入佳境',
    description: '累计完成 10 局游戏',
    icon: '🔥',
    condition: (s) => s.totalWins >= 10,
  },
  {
    id: 'win_50',
    name: '数独高手',
    description: '累计完成 50 局游戏',
    icon: '⭐',
    condition: (s) => s.totalWins >= 50,
  },
  {
    id: 'win_100',
    name: '数独大师',
    description: '累计完成 100 局游戏',
    icon: '👑',
    condition: (s) => s.totalWins >= 100,
  },
  {
    id: 'streak_3',
    name: '连胜将军',
    description: '连续获胜 3 局',
    icon: '⚡',
    condition: (s) => s.bestStreak >= 3,
  },
  {
    id: 'streak_7',
    name: '一周不败',
    description: '连续获胜 7 局',
    icon: '🗓️',
    condition: (s) => s.bestStreak >= 7,
  },
  {
    id: 'speed_demon',
    name: '闪电侠',
    description: '困难难度在 5 分钟内完成',
    icon: '⚡',
    condition: (s) => (s.bestTimes.hard ?? 9999) < 300,
  },
  {
    id: 'perfect_game',
    name: '完美游戏',
    description: '完成一局没有使用提示的游戏',
    icon: '💎',
    condition: () => false, // 需要游戏内追踪
  },
  {
    id: 'daily_streak_7',
    name: '每日挑战者',
    description: '连续 7 天完成每日挑战',
    icon: '📅',
    condition: () => false, // 需要单独追踪
  },
  {
    id: 'score_10000',
    name: '万分达人',
    description: '累计获得 10000 分',
    icon: '🏆',
    condition: (s) => s.totalScore >= 10000,
  },
];

/** 获取默认统计数据 */
function getDefaultStats(): GameStats {
  return {
    totalGames: 0,
    totalWins: 0,
    totalLosses: 0,
    currentStreak: 0,
    bestStreak: 0,
    totalPlayTime: 0,
    bestTimes: { easy: null, medium: null, hard: null, daily: null },
    totalScore: 0,
  };
}

/** 加载统计数据 */
export function loadStats(): GameStats {
  if (typeof window === 'undefined') return getDefaultStats();
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.stats);
    return stored ? { ...getDefaultStats(), ...JSON.parse(stored) } : getDefaultStats();
  } catch {
    return getDefaultStats();
  }
}

/** 保存统计数据 */
export function saveStats(stats: GameStats): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.stats, JSON.stringify(stats));
}

/** 加载成就状态 */
export function loadAchievements(): Achievement[] {
  if (typeof window === 'undefined') {
    return ACHIEVEMENTS.map(a => ({ ...a, unlockedAt: null }));
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.achievements);
    if (stored) {
      const parsed = JSON.parse(stored);
      return ACHIEVEMENTS.map(a => ({
        ...a,
        unlockedAt: parsed[a.id] || null,
      }));
    }
  } catch { /* ignore */ }
  return ACHIEVEMENTS.map(a => ({ ...a, unlockedAt: null }));
}

/** 保存成就状态 */
export function saveAchievements(achievements: Achievement[]): void {
  if (typeof window === 'undefined') return;
  const data: Record<string, string | null> = {};
  achievements.forEach(a => {
    data[a.id] = a.unlockedAt;
  });
  localStorage.setItem(STORAGE_KEYS.achievements, JSON.stringify(data));
}

/** 检查并解锁新成就 */
export function checkAchievements(stats: GameStats, achievements: Achievement[]): Achievement[] {
  const newAchievements: Achievement[] = [];
  const updated = achievements.map(a => {
    if (!a.unlockedAt && a.condition(stats)) {
      const unlocked = { ...a, unlockedAt: new Date().toISOString() };
      newAchievements.push(unlocked);
      return unlocked;
    }
    return a;
  });
  
  if (newAchievements.length > 0) {
    saveAchievements(updated);
  }
  return updated;
}

/** 获取今日日期字符串 */
export function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

/** 生成每日挑战种子 */
export function getDailySeed(): number {
  const today = getTodayString();
  let hash = 0;
  for (let i = 0; i < today.length; i++) {
    hash = ((hash << 5) - hash) + today.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

/** 加载每日挑战状态 */
export function loadDailyChallenge(): DailyChallenge {
  if (typeof window === 'undefined') {
    return {
      date: getTodayString(),
      seed: getDailySeed(),
      difficulty: 'daily',
      completed: false,
      completedAt: null,
      time: null,
      score: null,
    };
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.daily);
    if (stored) {
      const parsed = JSON.parse(stored) as DailyChallenge;
      // 检查是否是今天的
      if (parsed.date === getTodayString()) {
        return parsed;
      }
    }
  } catch { /* ignore */ }
  
  return {
    date: getTodayString(),
    seed: getDailySeed(),
    difficulty: 'daily',
    completed: false,
    completedAt: null,
    time: null,
    score: null,
  };
}

/** 保存每日挑战状态 */
export function saveDailyChallenge(challenge: DailyChallenge): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.daily, JSON.stringify(challenge));
}

/** 完成每日挑战 */
export function completeDailyChallenge(time: number, score: number): void {
  const challenge = loadDailyChallenge();
  if (!challenge.completed) {
    challenge.completed = true;
    challenge.completedAt = new Date().toISOString();
    challenge.time = time;
    challenge.score = score;
    saveDailyChallenge(challenge);
  }
}

/** 保存游戏状态 */
export function saveGameState(state: GameState): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.gameState, JSON.stringify(state));
}

/** 加载游戏状态 */
export function loadGameState(): GameState | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.gameState);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

/** 清除游戏状态 */
export function clearGameState(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.gameState);
}

/** 记录最后游玩时间 */
export function recordLastPlayed(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.lastPlayed, getTodayString());
}

/** 获取连续游玩天数 */
export function getConsecutiveDays(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const stored = localStorage.getItem('sudoku-consecutive-days');
    const data = stored ? JSON.parse(stored) : { count: 0, lastDate: '' };
    
    const today = getTodayString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    if (data.lastDate === today) {
      return data.count;
    } else if (data.lastDate === yesterdayStr) {
      const newCount = data.count + 1;
      localStorage.setItem('sudoku-consecutive-days', JSON.stringify({ count: newCount, lastDate: today }));
      return newCount;
    } else {
      localStorage.setItem('sudoku-consecutive-days', JSON.stringify({ count: 1, lastDate: today }));
      return 1;
    }
  } catch {
    return 0;
  }
}

/** 计算得分 */
export function calculateScore(
  difficulty: Difficulty,
  time: number,
  hintCount: number,
  errorCount: number
): number {
  const baseScore = { easy: 100, medium: 200, hard: 400, daily: 300 }[difficulty];
  const timeBonus = Math.max(0, 600 - time) * 0.5; // 10分钟内完成有时间奖励
  const hintPenalty = hintCount * 20;
  const errorPenalty = errorCount * 10;
  
  return Math.max(0, Math.floor(baseScore + timeBonus - hintPenalty - errorPenalty));
}
