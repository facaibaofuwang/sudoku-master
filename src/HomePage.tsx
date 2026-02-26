import { useState, useEffect } from 'react';
import type { Theme } from './theme';
import { themes, getStoredTheme, getSystemTheme, saveTheme } from './theme';
import { soundManager } from './sound';
import type { GameStats, Achievement, DailyChallenge, Difficulty } from './storage';
import { 
  loadStats, 
  loadAchievements, 
  loadDailyChallenge, 
  getTodayString
} from './storage';
import { APP_VERSION, PACKAGE_NAME } from './version';
import type { Language } from './i18n';
import { 
  getStoredLanguage, 
  getSystemLanguage, 
  saveLanguage, 
  languageNames,
  getTranslation 
} from './i18n';
import './HomePage.css';

interface HomePageProps {
  onStartGame: (difficulty: Difficulty) => void;
  onContinueGame: () => void;
  hasSavedGame: boolean;
}

export function HomePage({ onStartGame, onContinueGame, hasSavedGame }: HomePageProps) {
  const [theme, setTheme] = useState<Theme>(getStoredTheme() || getSystemTheme());
  const [language, setLanguage] = useState<Language>(getStoredLanguage() || getSystemLanguage());
  const [stats, setStats] = useState<GameStats | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [daily, setDaily] = useState<DailyChallenge | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(soundManager.isEnabled());
  
  // 获取翻译
  const t = getTranslation(language);

  useEffect(() => {
    setStats(loadStats());
    setAchievements(loadAchievements());
    setDaily(loadDailyChallenge());
  }, []);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    saveTheme(newTheme);
  };

  const toggleSound = () => {
    const newState = soundManager.toggle();
    setSoundEnabled(newState);
  };

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    saveLanguage(newLang);
  };

  const themeConfig = themes[theme];
  const unlockedCount = achievements.filter(a => a.unlockedAt).length;
  const isDailyAvailable = daily?.date === getTodayString() && !daily?.completed;

  return (
    <div className="home-page" style={{ background: themeConfig.colors.background }}>
      {/* Logo 区域 */}
      <div className="home-header">
        <div className="logo-container">
          <div className="logo-grid">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="logo-cell" style={{ 
                background: i % 2 === 0 ? themeConfig.colors.primary : themeConfig.colors.secondary 
              }} />
            ))}
          </div>
          <h1 style={{ color: themeConfig.colors.text }}>{t.appName}</h1>
          <p style={{ color: themeConfig.colors.textSecondary }}>Sudoku Master</p>
        </div>
      </div>

      {/* 主菜单 */}
      <div className="menu-container">
        {hasSavedGame && (
          <button 
            className="menu-btn continue-btn"
            onClick={() => { soundManager.play('click'); onContinueGame(); }}
            style={{ 
              background: themeConfig.colors.success,
              color: 'white'
            }}
          >
            <span className="btn-icon">▶️</span>
            <span className="btn-text">{t.continueGame}</span>
          </button>
        )}

        <button 
          className="menu-btn"
          onClick={() => { soundManager.play('click'); onStartGame('easy'); }}
          style={{ 
            background: themeConfig.colors.surface,
            color: themeConfig.colors.text,
            borderColor: themeConfig.colors.border
          }}
        >
          <span className="btn-icon">🌱</span>
          <span className="btn-text">{t.difficultyEasy}</span>
          <span className="btn-desc">{language === 'zh' ? '轻松上手' : language === 'en' ? 'Easy to start' : language === 'ru' ? 'Легко начать' : language === 'ja' ? '簡単に始める' : 'Facile à commencer'}</span>
        </button>

        <button 
          className="menu-btn"
          onClick={() => { soundManager.play('click'); onStartGame('medium'); }}
          style={{ 
            background: themeConfig.colors.surface,
            color: themeConfig.colors.text,
            borderColor: themeConfig.colors.border
          }}
        >
          <span className="btn-icon">🤔</span>
          <span className="btn-text">{t.difficultyMedium}</span>
          <span className="btn-desc">{language === 'zh' ? '需要思考' : language === 'en' ? 'Need thinking' : language === 'ru' ? 'Нужно думать' : language === 'ja' ? '考える必要' : 'Besoin de réfléchir'}</span>
        </button>

        <button 
          className="menu-btn"
          onClick={() => { soundManager.play('click'); onStartGame('hard'); }}
          style={{ 
            background: themeConfig.colors.surface,
            color: themeConfig.colors.text,
            borderColor: themeConfig.colors.border
          }}
        >
          <span className="btn-icon">🔥</span>
          <span className="btn-text">{t.difficultyHard}</span>
          <span className="btn-desc">{language === 'zh' ? '挑战极限' : language === 'en' ? 'Extreme challenge' : language === 'ru' ? 'Экстремально' : language === 'ja' ? '極限チャレンジ' : 'Défi extrême'}</span>
        </button>

        <button 
          className={`menu-btn daily-btn ${!isDailyAvailable ? 'completed' : ''}`}
          onClick={() => { 
            soundManager.play('click'); 
            if (isDailyAvailable) onStartGame('daily'); 
          }}
          disabled={!isDailyAvailable}
          style={{ 
            background: isDailyAvailable ? themeConfig.colors.accent : themeConfig.colors.surface,
            color: themeConfig.colors.text,
            borderColor: themeConfig.colors.border
          }}
        >
          <span className="btn-icon">📅</span>
          <span className="btn-text">{t.dailyChallenge}</span>
          <span className="btn-desc">
            {isDailyAvailable 
              ? (language === 'zh' ? '今日新题' : language === 'en' ? 'New today' : language === 'ru' ? 'Новое сегодня' : language === 'ja' ? '今日の新題' : 'Nouveau aujourd\'hui')
              : (language === 'zh' ? '今日已完成' : language === 'en' ? 'Completed' : language === 'ru' ? 'Завершено' : language === 'ja' ? '完了' : 'Terminé')
            }
          </span>
        </button>
      </div>

      {/* 首页广告栏位 */}
      <div className="home-ad-banner" id="home-ad-banner">
        <div className="home-ad-placeholder">
          <span>📢</span>
          <span>{t.adPlaceholder}</span>
        </div>
      </div>

      {/* 底部导航 */}
      <div className="home-footer">
        <button 
          className="footer-btn"
          onClick={() => { soundManager.play('click'); setShowStats(true); }}
          style={{ color: themeConfig.colors.textSecondary }}
        >
          <span className="footer-icon">📊</span>
          <span>{t.statistics}</span>
        </button>
        <button 
          className="footer-btn"
          onClick={() => { soundManager.play('click'); setShowAchievements(true); }}
          style={{ color: themeConfig.colors.textSecondary }}
        >
          <span className="footer-icon">🏆</span>
          <span>{t.achievements}</span>
          <span className="badge">{unlockedCount}/{achievements.length}</span>
        </button>
        <button 
          className="footer-btn"
          onClick={() => { soundManager.play('click'); setShowSettings(true); }}
          style={{ color: themeConfig.colors.textSecondary }}
        >
          <span className="footer-icon">⚙️</span>
          <span>{t.settings}</span>
        </button>
      </div>

      {/* 统计弹窗 */}
      {showStats && stats && (
        <div className="modal-overlay" onClick={() => setShowStats(false)}>
          <div className="modal stats-modal" onClick={e => e.stopPropagation()}>
            <h2 style={{ color: themeConfig.colors.text }}>📊 {t.statistics}</h2>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-value" style={{ color: themeConfig.colors.primary }}>
                  {stats.totalGames}
                </span>
                <span className="stat-label" style={{ color: themeConfig.colors.textSecondary }}>
                  {t.gamesPlayed}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-value" style={{ color: themeConfig.colors.success }}>
                  {stats.totalWins}
                </span>
                <span className="stat-label" style={{ color: themeConfig.colors.textSecondary }}>
                  {language === 'zh' ? '获胜' : language === 'en' ? 'Wins' : language === 'ru' ? 'Победы' : language === 'ja' ? '勝利' : 'Victoires'}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-value" style={{ color: themeConfig.colors.error }}>
                  {stats.totalLosses}
                </span>
                <span className="stat-label" style={{ color: themeConfig.colors.textSecondary }}>
                  {language === 'zh' ? '失败' : language === 'en' ? 'Losses' : language === 'ru' ? 'Поражения' : language === 'ja' ? '敗北' : 'Défaites'}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-value" style={{ color: themeConfig.colors.accent }}>
                  {stats.currentStreak}
                </span>
                <span className="stat-label" style={{ color: themeConfig.colors.textSecondary }}>
                  {t.currentStreak}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-value" style={{ color: themeConfig.colors.secondary }}>
                  {stats.bestStreak}
                </span>
                <span className="stat-label" style={{ color: themeConfig.colors.textSecondary }}>
                  {language === 'zh' ? '最高连胜' : language === 'en' ? 'Best Streak' : language === 'ru' ? 'Лучшая серия' : language === 'ja' ? '最高連勝' : 'Meilleure série'}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-value" style={{ color: themeConfig.colors.primary }}>
                  {stats.totalScore.toLocaleString()}
                </span>
                <span className="stat-label" style={{ color: themeConfig.colors.textSecondary }}>
                  {language === 'zh' ? '总积分' : language === 'en' ? 'Score' : language === 'ru' ? 'Очки' : language === 'ja' ? 'スコア' : 'Score'}
                </span>
              </div>
            </div>
            <div className="best-times">
              <h3 style={{ color: themeConfig.colors.text }}>{t.bestTimes}</h3>
              <div className="time-list">
                {(['easy', 'medium', 'hard'] as const).map(diff => (
                  <div key={diff} className="time-item">
                    <span className="time-diff" style={{ color: themeConfig.colors.textSecondary }}>
                      {diff === 'easy' ? `🌱 ${t.difficultyEasy}` : diff === 'medium' ? `🤔 ${t.difficultyMedium}` : `🔥 ${t.difficultyHard}`}
                    </span>
                    <span className="time-value" style={{ color: themeConfig.colors.text }}>
                      {stats.bestTimes[diff] 
                        ? `${Math.floor(stats.bestTimes[diff]! / 60)}:${(stats.bestTimes[diff]! % 60).toString().padStart(2, '0')}`
                        : '--:--'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <button 
              className="modal-close-btn"
              onClick={() => setShowStats(false)}
              style={{ background: themeConfig.colors.primary, color: 'white' }}
            >
              {t.close}
            </button>
          </div>
        </div>
      )}

      {/* 成就弹窗 */}
      {showAchievements && (
        <div className="modal-overlay" onClick={() => setShowAchievements(false)}>
          <div className="modal achievements-modal" onClick={e => e.stopPropagation()}>
            <h2 style={{ color: themeConfig.colors.text }}>🏆 {t.achievements}</h2>
            <p className="achievements-progress" style={{ color: themeConfig.colors.textSecondary }}>
              {unlockedCount}/{achievements.length} {language === 'zh' ? '个成就' : language === 'en' ? 'achievements' : language === 'ru' ? 'достижений' : language === 'ja' ? '実績' : 'succès'}
            </p>
            <div className="achievements-list">
              {achievements.map(ach => (
                <div 
                  key={ach.id} 
                  className={`achievement-item ${ach.unlockedAt ? 'unlocked' : 'locked'}`}
                  style={{ 
                    background: ach.unlockedAt ? themeConfig.colors.highlight : themeConfig.colors.surface,
                    borderColor: themeConfig.colors.border
                  }}
                >
                  <span className="achievement-icon">{ach.icon}</span>
                  <div className="achievement-info">
                    <span className="achievement-name" style={{ color: themeConfig.colors.text }}>
                      {ach.name}
                    </span>
                    <span className="achievement-desc" style={{ color: themeConfig.colors.textSecondary }}>
                      {ach.description}
                    </span>
                    {ach.unlockedAt && (
                      <span className="achievement-date" style={{ color: themeConfig.colors.success }}>
                        ✅ {new Date(ach.unlockedAt).toLocaleDateString('zh-CN')} 解锁
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button 
              className="modal-close-btn"
              onClick={() => setShowAchievements(false)}
              style={{ background: themeConfig.colors.primary, color: 'white' }}
            >
              关闭
            </button>
          </div>
        </div>
      )}

      {/* 设置弹窗 */}
      {showSettings && (
        <div className="modal-overlay" onClick={() => setShowSettings(false)}>
          <div className="modal settings-modal" onClick={e => e.stopPropagation()}>
            <h2 style={{ color: themeConfig.colors.text }}>⚙️ {t.settings}</h2>
            
            {/* 语言切换 */}
            <div className="setting-item">
              <span style={{ color: themeConfig.colors.text }}>{t.language}</span>
              <div className="language-toggle">
                {(['zh', 'en', 'ru', 'ja', 'fr'] as Language[]).map((lang) => (
                  <button 
                    key={lang}
                    className={language === lang ? 'active' : ''}
                    onClick={() => handleLanguageChange(lang)}
                    style={{ 
                      background: language === lang ? themeConfig.colors.primary : themeConfig.colors.surface,
                      color: language === lang ? 'white' : themeConfig.colors.text,
                      fontSize: '12px',
                      padding: '6px 10px'
                    }}
                  >
                    {languageNames[lang]}
                  </button>
                ))}
              </div>
            </div>

            <div className="setting-item">
              <span style={{ color: themeConfig.colors.text }}>{t.theme}</span>
              <div className="theme-toggle">
                <button 
                  className={theme === 'light' ? 'active' : ''}
                  onClick={() => handleThemeChange('light')}
                  style={{ 
                    background: theme === 'light' ? themeConfig.colors.primary : themeConfig.colors.surface,
                    color: theme === 'light' ? 'white' : themeConfig.colors.text
                  }}
                >
                  ☀️ {t.themeLight}
                </button>
                <button 
                  className={theme === 'dark' ? 'active' : ''}
                  onClick={() => handleThemeChange('dark')}
                  style={{ 
                    background: theme === 'dark' ? themeConfig.colors.primary : themeConfig.colors.surface,
                    color: theme === 'dark' ? 'white' : themeConfig.colors.text
                  }}
                >
                  🌙 {t.themeDark}
                </button>
              </div>
            </div>

            <div className="setting-item">
              <span style={{ color: themeConfig.colors.text }}>{t.soundEffects}</span>
              <button 
                className={`sound-toggle ${soundEnabled ? 'on' : 'off'}`}
                onClick={toggleSound}
                style={{ 
                  background: soundEnabled ? themeConfig.colors.success : themeConfig.colors.error,
                  color: 'white'
                }}
              >
                {soundEnabled ? `🔊 ${t.soundOn}` : `🔇 ${t.soundOff}`}
              </button>
            </div>

            {/* 版本信息 */}
            <div className="setting-item version-info">
              <span style={{ color: themeConfig.colors.textSecondary }}>{t.version}</span>
              <span style={{ color: themeConfig.colors.text, fontFamily: 'monospace' }}>
                v{APP_VERSION}
              </span>
            </div>
            <div className="setting-item package-info">
              <span style={{ color: themeConfig.colors.textSecondary, fontSize: '11px' }}>{t.packageName}</span>
              <span style={{ color: themeConfig.colors.textSecondary, fontSize: '11px', fontFamily: 'monospace' }}>
                {PACKAGE_NAME}
              </span>
            </div>

            <button 
              className="modal-close-btn"
              onClick={() => setShowSettings(false)}
              style={{ background: themeConfig.colors.primary, color: 'white' }}
            >
              {t.close}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
