// 多语言支持
export type Language = 'zh' | 'en' | 'ru' | 'ja' | 'fr';

export interface Translations {
  // 通用
  appName: string;
  version: string;
  packageName: string;
  confirm: string;
  cancel: string;
  close: string;
  back: string;
  
  // 首页
  continueGame: string;
  newGame: string;
  statistics: string;
  achievements: string;
  dailyChallenge: string;
  settings: string;
  difficulty: string;
  difficultyEasy: string;
  difficultyMedium: string;
  difficultyHard: string;
  
  // 游戏页面
  notes: string;
  hint: string;
  erase: string;
  undo: string;
  timer: string;
  errors: string;
  hintsLeft: string;
  gamePaused: string;
  gameFailed: string;
  gameCompleted: string;
  congratulations: string;
  newRecord: string;
  timeUsed: string;
  bestTime: string;
  continue: string;
  tryAgain: string;
  
  // 设置
  theme: string;
  themeLight: string;
  themeDark: string;
  soundEffects: string;
  soundOn: string;
  soundOff: string;
  language: string;
  
  // 统计
  gamesPlayed: string;
  winRate: string;
  avgTime: string;
  bestTimes: string;
  currentStreak: string;
  
  // 成就
  achievementsLocked: string;
  achievementsUnlocked: string;
  
  // 提示信息
  hintLimitReached: string;
  tooManyErrors: string;
  numberCompleted: string;
  
  // 广告占位
  adPlaceholder: string;
}

const translations: Record<Language, Translations> = {
  // 中文
  zh: {
    appName: '数独大师',
    version: '版本号',
    packageName: '包名',
    confirm: '确认',
    cancel: '取消',
    close: '关闭',
    back: '返回',
    
    continueGame: '继续游戏',
    newGame: '新游戏',
    statistics: '统计',
    achievements: '成就',
    dailyChallenge: '每日挑战',
    settings: '设置',
    difficulty: '难度',
    difficultyEasy: '入门',
    difficultyMedium: '中等',
    difficultyHard: '困难',
    
    notes: '笔记',
    hint: '提示',
    erase: '擦除',
    undo: '撤销',
    timer: '时间',
    errors: '错误',
    hintsLeft: '提示剩余',
    gamePaused: '游戏暂停',
    gameFailed: '游戏失败',
    gameCompleted: '完成！',
    congratulations: '恭喜你！',
    newRecord: '新纪录！',
    timeUsed: '用时',
    bestTime: '最佳',
    continue: '继续',
    tryAgain: '重试',
    
    theme: '主题',
    themeLight: '浅色',
    themeDark: '深色',
    soundEffects: '声音效果',
    soundOn: '开启',
    soundOff: '关闭',
    language: '语言',
    
    gamesPlayed: '总游戏数',
    winRate: '胜率',
    avgTime: '平均用时',
    bestTimes: '最佳成绩',
    currentStreak: '当前连胜',
    
    achievementsLocked: '未解锁',
    achievementsUnlocked: '已解锁',
    
    hintLimitReached: '提示次数已达上限',
    tooManyErrors: '错误次数过多，游戏结束',
    numberCompleted: '该数字已完成',
    
    adPlaceholder: '广告位预留',
  },
  
  // English
  en: {
    appName: 'Sudoku Master',
    version: 'Version',
    packageName: 'Package',
    confirm: 'Confirm',
    cancel: 'Cancel',
    close: 'Close',
    back: 'Back',
    
    continueGame: 'Continue',
    newGame: 'New Game',
    statistics: 'Statistics',
    achievements: 'Achievements',
    dailyChallenge: 'Daily Challenge',
    settings: 'Settings',
    difficulty: 'Difficulty',
    difficultyEasy: 'Easy',
    difficultyMedium: 'Medium',
    difficultyHard: 'Hard',
    
    notes: 'Notes',
    hint: 'Hint',
    erase: 'Erase',
    undo: 'Undo',
    timer: 'Time',
    errors: 'Errors',
    hintsLeft: 'Hints',
    gamePaused: 'Game Paused',
    gameFailed: 'Game Over',
    gameCompleted: 'Completed!',
    congratulations: 'Congratulations!',
    newRecord: 'New Record!',
    timeUsed: 'Time',
    bestTime: 'Best',
    continue: 'Continue',
    tryAgain: 'Try Again',
    
    theme: 'Theme',
    themeLight: 'Light',
    themeDark: 'Dark',
    soundEffects: 'Sound',
    soundOn: 'On',
    soundOff: 'Off',
    language: 'Language',
    
    gamesPlayed: 'Games',
    winRate: 'Win Rate',
    avgTime: 'Avg Time',
    bestTimes: 'Best Times',
    currentStreak: 'Streak',
    
    achievementsLocked: 'Locked',
    achievementsUnlocked: 'Unlocked',
    
    hintLimitReached: 'No hints left',
    tooManyErrors: 'Too many errors',
    numberCompleted: 'Number completed',
    
    adPlaceholder: 'Advertisement',
  },
  
  // Русский (Russian)
  ru: {
    appName: 'Судоку Мастер',
    version: 'Версия',
    packageName: 'Пакет',
    confirm: 'Подтвердить',
    cancel: 'Отмена',
    close: 'Закрыть',
    back: 'Назад',
    
    continueGame: 'Продолжить',
    newGame: 'Новая игра',
    statistics: 'Статистика',
    achievements: 'Достижения',
    dailyChallenge: 'Ежедневный вызов',
    settings: 'Настройки',
    difficulty: 'Сложность',
    difficultyEasy: 'Легко',
    difficultyMedium: 'Средне',
    difficultyHard: 'Сложно',
    
    notes: 'Заметки',
    hint: 'Подсказка',
    erase: 'Стереть',
    undo: 'Отменить',
    timer: 'Время',
    errors: 'Ошибки',
    hintsLeft: 'Подсказки',
    gamePaused: 'Пауза',
    gameFailed: 'Игра окончена',
    gameCompleted: 'Завершено!',
    congratulations: 'Поздравляем!',
    newRecord: 'Новый рекорд!',
    timeUsed: 'Время',
    bestTime: 'Лучшее',
    continue: 'Продолжить',
    tryAgain: 'Попробовать снова',
    
    theme: 'Тема',
    themeLight: 'Светлая',
    themeDark: 'Темная',
    soundEffects: 'Звук',
    soundOn: 'Вкл',
    soundOff: 'Выкл',
    language: 'Язык',
    
    gamesPlayed: 'Игры',
    winRate: 'Победы',
    avgTime: 'Среднее',
    bestTimes: 'Лучшие',
    currentStreak: 'Серия',
    
    achievementsLocked: 'Заблокировано',
    achievementsUnlocked: 'Разблокировано',
    
    hintLimitReached: 'Подсказок не осталось',
    tooManyErrors: 'Слишком много ошибок',
    numberCompleted: 'Число завершено',
    
    adPlaceholder: 'Реклама',
  },
  
  // 日本語 (Japanese)
  ja: {
    appName: '数独マスター',
    version: 'バージョン',
    packageName: 'パッケージ',
    confirm: '確認',
    cancel: 'キャンセル',
    close: '閉じる',
    back: '戻る',
    
    continueGame: '続ける',
    newGame: '新しいゲーム',
    statistics: '統計',
    achievements: '実績',
    dailyChallenge: 'デイリーチャレンジ',
    settings: '設定',
    difficulty: '難易度',
    difficultyEasy: '初級',
    difficultyMedium: '中級',
    difficultyHard: '上級',
    
    notes: 'メモ',
    hint: 'ヒント',
    erase: '消去',
    undo: '元に戻す',
    timer: '時間',
    errors: 'ミス',
    hintsLeft: 'ヒント残り',
    gamePaused: '一時停止',
    gameFailed: 'ゲームオーバー',
    gameCompleted: 'クリア！',
    congratulations: 'おめでとう！',
    newRecord: '新記録！',
    timeUsed: 'タイム',
    bestTime: 'ベスト',
    continue: '続ける',
    tryAgain: 'もう一度',
    
    theme: 'テーマ',
    themeLight: 'ライト',
    themeDark: 'ダーク',
    soundEffects: '効果音',
    soundOn: 'ON',
    soundOff: 'OFF',
    language: '言語',
    
    gamesPlayed: 'プレイ回数',
    winRate: '勝率',
    avgTime: '平均時間',
    bestTimes: 'ベストタイム',
    currentStreak: '連勝',
    
    achievementsLocked: '未解除',
    achievementsUnlocked: '解除済み',
    
    hintLimitReached: 'ヒントがありません',
    tooManyErrors: 'ミスが多すぎます',
    numberCompleted: '数字が完成しました',
    
    adPlaceholder: '広告',
  },
  
  // Français (French)
  fr: {
    appName: 'Sudoku Maître',
    version: 'Version',
    packageName: 'Package',
    confirm: 'Confirmer',
    cancel: 'Annuler',
    close: 'Fermer',
    back: 'Retour',
    
    continueGame: 'Continuer',
    newGame: 'Nouvelle partie',
    statistics: 'Statistiques',
    achievements: 'Succès',
    dailyChallenge: 'Défi quotidien',
    settings: 'Paramètres',
    difficulty: 'Difficulté',
    difficultyEasy: 'Facile',
    difficultyMedium: 'Moyen',
    difficultyHard: 'Difficile',
    
    notes: 'Notes',
    hint: 'Indice',
    erase: 'Effacer',
    undo: 'Annuler',
    timer: 'Temps',
    errors: 'Erreurs',
    hintsLeft: 'Indices',
    gamePaused: 'Pause',
    gameFailed: 'Game Over',
    gameCompleted: 'Terminé !',
    congratulations: 'Félicitations !',
    newRecord: 'Nouveau record !',
    timeUsed: 'Temps',
    bestTime: 'Meilleur',
    continue: 'Continuer',
    tryAgain: 'Réessayer',
    
    theme: 'Thème',
    themeLight: 'Clair',
    themeDark: 'Sombre',
    soundEffects: 'Son',
    soundOn: 'Activé',
    soundOff: 'Désactivé',
    language: 'Langue',
    
    gamesPlayed: 'Parties',
    winRate: 'Victoires',
    avgTime: 'Temps moyen',
    bestTimes: 'Meilleurs temps',
    currentStreak: 'Série',
    
    achievementsLocked: 'Verrouillé',
    achievementsUnlocked: 'Déverrouillé',
    
    hintLimitReached: 'Plus d\'indices',
    tooManyErrors: 'Trop d\'erreurs',
    numberCompleted: 'Nombre terminé',
    
    adPlaceholder: 'Publicité',
  },
};

// 语言显示名称
export const languageNames: Record<Language, string> = {
  zh: '中文',
  en: 'English',
  ru: 'Русский',
  ja: '日本語',
  fr: 'Français',
};

// 获取当前语言
export function getStoredLanguage(): Language | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('sudoku-language');
  if (stored && ['zh', 'en', 'ru', 'ja', 'fr'].includes(stored)) {
    return stored as Language;
  }
  return null;
}

// 保存语言设置
export function saveLanguage(lang: Language): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('sudoku-language', lang);
}

// 获取系统语言
export function getSystemLanguage(): Language {
  if (typeof window === 'undefined') return 'en';
  const systemLang = navigator.language.toLowerCase();
  if (systemLang.startsWith('zh')) return 'zh';
  if (systemLang.startsWith('ru')) return 'ru';
  if (systemLang.startsWith('ja')) return 'ja';
  if (systemLang.startsWith('fr')) return 'fr';
  return 'en';
}

// 获取翻译
export function getTranslation(lang: Language): Translations {
  return translations[lang] || translations.en;
}

// 默认导出
export default translations;
