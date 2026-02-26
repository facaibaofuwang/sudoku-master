import { useState, useEffect, useCallback } from 'react';
import { HomePage } from './HomePage';
import { SudokuGame } from './SudokuGame';
import type { Theme } from './theme';
import { themes, getStoredTheme, getSystemTheme } from './theme';
import type { Difficulty } from './storage';
import { loadGameState, loadDailyChallenge } from './storage';
import './App.css';

type Page = 'home' | 'game';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [gameDifficulty, setGameDifficulty] = useState<Difficulty>('medium');
  const [gameSeed, setGameSeed] = useState<number | undefined>(undefined);
  const [hasSavedGame, setHasSavedGame] = useState(false);
  const [theme, setTheme] = useState<Theme>(getStoredTheme() || getSystemTheme());

  // 检查是否有保存的游戏
  useEffect(() => {
    const savedGame = loadGameState();
    setHasSavedGame(!!savedGame);
  }, []);

  // 监听主题变化
  useEffect(() => {
    const handleStorage = () => {
      const storedTheme = getStoredTheme();
      if (storedTheme) {
        setTheme(storedTheme);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleStartGame = useCallback((difficulty: Difficulty) => {
    setGameDifficulty(difficulty);
    
    // 每日挑战使用固定种子
    if (difficulty === 'daily') {
      const daily = loadDailyChallenge();
      setGameSeed(daily.seed);
    } else {
      setGameSeed(undefined);
    }
    
    setCurrentPage('game');
  }, []);

  const handleContinueGame = useCallback(() => {
    const savedGame = loadGameState();
    if (savedGame) {
      setGameDifficulty(savedGame.difficulty);
      setGameSeed(undefined); // 继续游戏不使用种子
      setCurrentPage('game');
    }
  }, []);

  const handleBackToHome = useCallback(() => {
    setCurrentPage('home');
    // 重新检查是否有保存的游戏
    const savedGame = loadGameState();
    setHasSavedGame(!!savedGame);
  }, []);

  const themeConfig = themes[theme];

  return (
    <div 
      className="app"
      style={{ 
        background: themeConfig.colors.background,
        color: themeConfig.colors.text
      }}
    >
      {currentPage === 'home' ? (
        <HomePage 
          onStartGame={handleStartGame}
          onContinueGame={handleContinueGame}
          hasSavedGame={hasSavedGame}
        />
      ) : (
        <SudokuGame 
          difficulty={gameDifficulty}
          seed={gameSeed}
          onBack={handleBackToHome}
        />
      )}
    </div>
  );
}

export default App;
