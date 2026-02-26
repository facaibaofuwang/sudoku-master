import { useState, useEffect, useCallback } from 'react';
import { SudokuGenerator } from './SudokuGenerator';
import type { Difficulty } from './storage';
import { saveGameState, loadGameState, clearGameState, loadStats, saveStats, loadAchievements, checkAchievements, calculateScore } from './storage';
import type { Language } from './i18n';
import { getStoredLanguage, getSystemLanguage, getTranslation } from './i18n';
import './SudokuGame.css';

interface Cell {
  value: number;
  isFixed: boolean;
  notes: number[];
  isError: boolean;
}

interface SudokuGameProps {
  difficulty: Difficulty;
  seed?: number;
  onBack: () => void;
}

export function SudokuGame({ difficulty, seed, onBack }: SudokuGameProps) {
  const [language, setLanguage] = useState<Language>(getStoredLanguage() || getSystemLanguage());
  const t = getTranslation(language);
  
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [solution, setSolution] = useState<number[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [gameTime, setGameTime] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [isNoteMode, setIsNoteMode] = useState(false);
  const [history, setHistory] = useState<Cell[][][]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [hintCount, setHintCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [isFailed, setIsFailed] = useState(false);

  // 游戏限制常量
  const MAX_HINTS = 3;
  const MAX_ERRORS = 5;

  // 保存游戏状态
  const saveCurrentGame = useCallback(() => {
    if (!isGameActive || isComplete || grid.length === 0) return;
    
    const fixedCells = grid.map(row => row.map(cell => cell.isFixed));
    const notes = grid.map(row => row.map(cell => cell.notes));
    const gridValues = grid.map(row => row.map(cell => cell.value));
    
    saveGameState({
      grid: gridValues,
      solution,
      fixedCells,
      notes,
      difficulty,
      gameTime,
      hintCount,
      errorCount,
      score: 0,
      startedAt: new Date().toISOString(),
    });
  }, [grid, solution, difficulty, gameTime, hintCount, errorCount, isGameActive, isComplete]);

  // 初始化游戏
  const initGame = useCallback(() => {
    const generator = seed !== undefined ? new SudokuGenerator(seed) : new SudokuGenerator();
    const diff = difficulty === 'daily' ? 'medium' : difficulty;
    const { puzzle, solution: sol } = generator.generatePuzzle(diff);
    
    const initialGrid: Cell[][] = puzzle.map((row) => 
      row.map((val) => ({
        value: val,
        isFixed: val !== 0,
        notes: [],
        isError: false
      }))
    );
    
    setGrid(initialGrid);
    setSolution(sol);
    setSelectedCell(null);
    setGameTime(0);
    setIsGameActive(true);
    setHistory([]);
    setIsComplete(false);
    setHintCount(0);
    setErrorCount(0);
    setIsFailed(false);
  }, [difficulty, seed]);

  // 首次加载
  useEffect(() => {
    // 尝试加载保存的游戏状态
    const savedGame = loadGameState();
    if (savedGame && savedGame.difficulty === difficulty) {
      // 恢复游戏状态
      const restoredGrid: Cell[][] = savedGame.grid.map((row, r) => 
        row.map((val, c) => ({
          value: val,
          isFixed: savedGame.fixedCells[r][c],
          notes: savedGame.notes[r][c] || [],
          isError: false
        }))
      );
      setGrid(restoredGrid);
      setSolution(savedGame.solution);
      setGameTime(savedGame.gameTime);
      setHintCount(savedGame.hintCount);
      setErrorCount(savedGame.errorCount);
      setIsGameActive(true);
      setIsComplete(false);
    } else {
      initGame();
    }
  }, [initGame, difficulty]);

  // 计时器 + 自动保存
  useEffect(() => {
    if (!isGameActive || isComplete) return;
    const timer = setInterval(() => {
      setGameTime(t => t + 1);
      // 每30秒自动保存
      if (gameTime > 0 && gameTime % 30 === 0) {
        saveCurrentGame();
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isGameActive, isComplete, gameTime, saveCurrentGame]);

  // 监听语言变化
  useEffect(() => {
    const checkLanguage = () => {
      const storedLang = getStoredLanguage();
      if (storedLang && storedLang !== language) {
        setLanguage(storedLang);
      }
    };
    const interval = setInterval(checkLanguage, 500);
    return () => clearInterval(interval);
  }, [language]);

  // 页面卸载前保存
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveCurrentGame();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [saveCurrentGame]);

  // 检查是否完成
  useEffect(() => {
    if (grid.length === 0) return;
    const isFull = grid.every(row => row.every(cell => cell.value !== 0));
    if (isFull) {
      const isCorrect = grid.every((row, r) => 
        row.every((cell, c) => cell.value === solution[r][c])
      );
      if (isCorrect && !isComplete) {
        setIsComplete(true);
        setIsGameActive(false);
        
        // 计算得分并更新统计
        const score = calculateScore(difficulty, gameTime, hintCount, errorCount);
        const stats = loadStats();
        stats.totalGames += 1;
        stats.totalWins += 1;
        stats.currentStreak += 1;
        if (stats.currentStreak > stats.bestStreak) {
          stats.bestStreak = stats.currentStreak;
        }
        stats.totalScore += score;
        stats.totalPlayTime += gameTime;
        
        // 更新最佳时间
        if (difficulty !== 'daily') {
          const currentBest = stats.bestTimes[difficulty];
          if (!currentBest || gameTime < currentBest) {
            stats.bestTimes[difficulty] = gameTime;
          }
        }
        
        saveStats(stats);
        
        // 检查成就
        const achievements = loadAchievements();
        checkAchievements(stats, achievements);
        
        // 清除保存的游戏状态
        clearGameState();
      }
    }
  }, [grid, solution, isComplete, difficulty, gameTime, hintCount, errorCount]);

  // 选择格子（允许选中所有格子，包括固定格子用于高亮）
  const handleCellClick = (row: number, col: number) => {
    setSelectedCell({ row, col });
  };

  // 输入数字
  const handleNumberInput = (num: number) => {
    if (!selectedCell) return;
    const { row, col } = selectedCell;
    if (grid[row][col].isFixed) return;

    // 保存历史
    setHistory(prev => [...prev, grid.map(r => r.map(c => ({ ...c })))]);

    setGrid(prev => {
      const newGrid = prev.map(r => r.map(c => ({ ...c })));
      
      if (isNoteMode) {
        // 笔记模式
        const notes = newGrid[row][col].notes;
        if (notes.includes(num)) {
          newGrid[row][col].notes = notes.filter(n => n !== num);
        } else {
          newGrid[row][col].notes = [...notes, num].sort();
        }
      } else {
        // 输入模式
        newGrid[row][col].value = num;
        newGrid[row][col].notes = [];
        
        // 检查是否正确
        if (num !== solution[row][col]) {
          newGrid[row][col].isError = true;
          const newErrorCount = errorCount + 1;
          setErrorCount(newErrorCount);
          // 检查是否超过最大错误次数
          if (newErrorCount >= MAX_ERRORS) {
            setIsFailed(true);
            setIsGameActive(false);
          }
        } else {
          newGrid[row][col].isError = false;
        }
      }
      
      return newGrid;
    });
  };

  // 撤销
  const handleUndo = () => {
    if (history.length === 0) return;
    setGrid(history[history.length - 1]);
    setHistory(prev => prev.slice(0, -1));
  };

  // 擦除
  const handleErase = () => {
    if (!selectedCell) return;
    const { row, col } = selectedCell;
    if (grid[row][col].isFixed) return;
    
    setHistory(prev => [...prev, grid.map(r => r.map(c => ({ ...c })))]);
    setGrid(prev => {
      const newGrid = prev.map(r => r.map(c => ({ ...c })));
      newGrid[row][col].value = 0;
      newGrid[row][col].notes = [];
      newGrid[row][col].isError = false;
      return newGrid;
    });
  };

  // 提示
  const handleHint = () => {
    if (!selectedCell) return;
    // 检查提示次数是否用完
    if (hintCount >= MAX_HINTS) return;
    const { row, col } = selectedCell;
    if (grid[row][col].isFixed || grid[row][col].value !== 0) return;
    
    setHintCount(prev => prev + 1);
    const correctValue = solution[row][col];
    
    // 保存历史
    setHistory(prev => [...prev, grid.map(r => r.map(c => ({ ...c })))]);
    
    setGrid(prev => {
      const newGrid = prev.map(r => r.map(c => ({ ...c })));
      newGrid[row][col].value = correctValue;
      newGrid[row][col].notes = [];
      return newGrid;
    });
  };

  // 格式化时间
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 计算每个数字的出现次数
  const getNumberCounts = useCallback(() => {
    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
    if (grid.length === 0) return counts;
    
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const value = grid[row][col].value;
        if (value >= 1 && value <= 9) {
          counts[value]++;
        }
      }
    }
    return counts;
  }, [grid]);

  const numberCounts = getNumberCounts();

  // 获取高亮类名
  const getCellClassName = (row: number, col: number, cell: Cell) => {
    const classes = ['cell'];
    
    if (cell.isFixed) classes.push('fixed');
    if (cell.isError) classes.push('error');
    if (selectedCell?.row === row && selectedCell?.col === col) classes.push('selected');
    
    // 高亮选中格子的行和列
    if (selectedCell) {
      if (selectedCell.row === row) classes.push('highlight-row');
      if (selectedCell.col === col) classes.push('highlight-col');
    }
    
    // 高亮相同数字
    if (selectedCell && grid[selectedCell.row][selectedCell.col].value !== 0) {
      if (cell.value === grid[selectedCell.row][selectedCell.col].value) {
        classes.push('same-number');
      }
    }
    
    // 3x3 分隔线
    if (col === 2 || col === 5) classes.push('border-right');
    if (row === 2 || row === 5) classes.push('border-bottom');
    
    return classes.join(' ');
  };

  if (grid.length === 0) return <div className="loading">{language === 'zh' ? '加载中...' : language === 'en' ? 'Loading...' : language === 'ru' ? 'Загрузка...' : language === 'ja' ? '読み込み中...' : 'Chargement...'}</div>;

  return (
    <div className="sudoku-game">
      {/* 顶部栏 */}
      <div className="header">
        <button className="back-btn" onClick={() => { saveCurrentGame(); onBack(); }}>
          ← {t.back}
        </button>
        <div className="timer">⏱️ {formatTime(gameTime)}</div>
        <button className="new-game-btn" onClick={() => { clearGameState(); initGame(); }}>
          🔄 {t.newGame}
        </button>
      </div>

      {/* 游戏棋盘 */}
      <div className="board-container">
        <div className="sudoku-board">
          {grid.map((row, r) => (
            <div key={r} className="board-row">
              {row.map((cell, c) => (
                <div
                  key={`${r}-${c}`}
                  className={getCellClassName(r, c, cell)}
                  onClick={() => handleCellClick(r, c)}
                >
                  {cell.value !== 0 ? (
                    <span className="cell-value">{cell.value}</span>
                  ) : cell.notes.length > 0 ? (
                    <div className="cell-notes">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                        <span key={n} className="note">
                          {cell.notes.includes(n) ? n : ''}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* 功能按钮 */}
      <div className="action-bar">
        <button 
          className={`action-btn ${isNoteMode ? 'active' : ''}`}
          onClick={() => setIsNoteMode(!isNoteMode)}
        >
          📝<br/>{t.notes}
        </button>
        <button 
          className="action-btn" 
          onClick={handleHint}
          disabled={hintCount >= MAX_HINTS}
        >
          💡<br/>{t.hint} {hintCount}/{MAX_HINTS}
        </button>
        <button className="action-btn" onClick={handleErase}>
          🧼<br/>{t.erase}
        </button>
      </div>

      {/* 数字键盘 - 2排布局，撤销按钮合并 */}
      <div className="number-pad-container">
        <div className="number-pad-row">
          {[1, 2, 3, 4, 5].map(num => {
            const count = numberCounts[num] || 0;
            const isComplete = count >= 9;
            return (
              <button
                key={num}
                className={`number-btn ${isComplete ? 'complete' : ''}`}
                onClick={() => handleNumberInput(num)}
                disabled={isComplete}
                title={isComplete ? t.numberCompleted : `${count}/9`}
              >
                {num}
              </button>
            );
          })}
        </div>
        <div className="number-pad-row">
          {[6, 7, 8, 9].map(num => {
            const count = numberCounts[num] || 0;
            const isComplete = count >= 9;
            return (
              <button
                key={num}
                className={`number-btn ${isComplete ? 'complete' : ''}`}
                onClick={() => handleNumberInput(num)}
                disabled={isComplete}
                title={isComplete ? t.numberCompleted : `${count}/9`}
              >
                {num}
              </button>
            );
          })}
          <button 
            className="undo-btn" 
            onClick={handleUndo}
            disabled={history.length === 0}
            title={t.undo}
          >
            <span>↩️</span>
            <span style={{ fontSize: '10px' }}>{t.undo}</span>
          </button>
        </div>
      </div>

      {/* 广告栏位 */}
      <div className="ad-banner" id="game-ad-banner">
        <div className="ad-placeholder">
          <span>📢</span>
          <span>{t.adPlaceholder}</span>
        </div>
      </div>

      {/* 完成弹窗 */}
      {isComplete && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>🎉 {t.gameCompleted}</h2>
            <p>{t.timeUsed}: {formatTime(gameTime)}</p>
            <p>{t.difficulty}: {difficulty === 'easy' ? `🌱 ${t.difficultyEasy}` : difficulty === 'medium' ? `🤔 ${t.difficultyMedium}` : difficulty === 'hard' ? `🔥 ${t.difficultyHard}` : `📅 ${t.dailyChallenge}`}</p>
            <p>{t.hint}: {hintCount} | {t.errors}: {errorCount}</p>
            <div className="modal-buttons">
              <button onClick={() => { clearGameState(); initGame(); }}>{t.newGame}</button>
              <button onClick={onBack} className="secondary">{t.back}</button>
            </div>
          </div>
        </div>
      )}

      {/* 失败弹窗 */}
      {isFailed && (
        <div className="modal-overlay">
          <div className="modal fail-modal">
            <h2>😢 {t.gameFailed}</h2>
            <p>{t.tooManyErrors}</p>
            <p>{t.difficulty}: {difficulty === 'easy' ? `🌱 ${t.difficultyEasy}` : difficulty === 'medium' ? `🤔 ${t.difficultyMedium}` : difficulty === 'hard' ? `🔥 ${t.difficultyHard}` : `📅 ${t.dailyChallenge}`}</p>
            <p>{t.timeUsed}: {formatTime(gameTime)} | {t.errors}: {errorCount}</p>
            <div className="modal-buttons">
              <button onClick={() => { clearGameState(); initGame(); }}>{t.tryAgain}</button>
              <button onClick={onBack} className="secondary">{t.back}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
