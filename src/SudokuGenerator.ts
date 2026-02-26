/** 数独生成器 - 生成唯一解的数独题目 */
export class SudokuGenerator {
  private grid: number[][] = Array(9).fill(null).map(() => Array(9).fill(0));
  private rng: () => number;

  constructor(seed?: number) {
    // 使用种子随机数生成器（用于每日挑战）
    if (seed !== undefined) {
      this.rng = this.createSeededRandom(seed);
    } else {
      this.rng = Math.random;
    }
  }

  /** 种子随机数生成器（线性同余） */
  private createSeededRandom(seed: number): () => number {
    let s = seed;
    return () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
  }

  // 生成完整解答
  generateSolution(): number[][] {
    this.grid = Array(9).fill(null).map(() => Array(9).fill(0));
    this.fillGrid(0, 0);
    return this.grid.map(row => [...row]);
  }

  private fillGrid(row: number, col: number): boolean {
    if (row === 9) return true;
    
    const nextRow = col === 8 ? row + 1 : row;
    const nextCol = col === 8 ? 0 : col + 1;
    
    const numbers = this.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    
    for (const num of numbers) {
      if (this.isValid(row, col, num)) {
        this.grid[row][col] = num;
        if (this.fillGrid(nextRow, nextCol)) return true;
        this.grid[row][col] = 0;
      }
    }
    return false;
  }

  private isValid(row: number, col: number, num: number): boolean {
    // 检查行
    for (let c = 0; c < 9; c++) {
      if (this.grid[row][c] === num) return false;
    }
    // 检查列
    for (let r = 0; r < 9; r++) {
      if (this.grid[r][col] === num) return false;
    }
    // 检查3x3宫格
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let r = boxRow; r < boxRow + 3; r++) {
      for (let c = boxCol; c < boxCol + 3; c++) {
        if (this.grid[r][c] === num) return false;
      }
    }
    return true;
  }

  private shuffle<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(this.rng() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // 挖空生成题目
  generatePuzzle(difficulty: 'easy' | 'medium' | 'hard' | 'daily' = 'medium'): { puzzle: number[][], solution: number[][] } {
    const solution = this.generateSolution();
    const puzzle = solution.map(row => [...row]);
    
    // 根据难度决定挖空数量
    const cellsToRemove = {
      easy: 35,
      medium: 45,
      hard: 55,
      daily: 45
    }[difficulty];
    
    const positions = this.shuffle(Array.from({ length: 81 }, (_, i) => ({
      row: Math.floor(i / 9),
      col: i % 9
    })));
    
    let removed = 0;
    for (const { row, col } of positions) {
      if (removed >= cellsToRemove) break;
      
      const backup = puzzle[row][col];
      puzzle[row][col] = 0;
      
      // 验证唯一解（简化版：尝试解一次）
      if (this.hasUniqueSolution(puzzle)) {
        removed++;
      } else {
        puzzle[row][col] = backup;
      }
    }
    
    return { puzzle, solution };
  }

  private hasUniqueSolution(grid: number[][]): boolean {
    // 简化验证：用回溯法计数
    let count = 0;
    const temp = grid.map(row => [...row]);
    
    const solve = (): boolean => {
      if (count > 1) return false;
      
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (temp[r][c] === 0) {
            for (let num = 1; num <= 9; num++) {
              if (this.isValidInGrid(temp, r, c, num)) {
                temp[r][c] = num;
                if (solve()) return true;
                temp[r][c] = 0;
              }
            }
            return false;
          }
        }
      }
      count++;
      return count <= 1;
    };
    
    solve();
    return count === 1;
  }

  private isValidInGrid(grid: number[][], row: number, col: number, num: number): boolean {
    for (let c = 0; c < 9; c++) if (grid[row][c] === num) return false;
    for (let r = 0; r < 9; r++) if (grid[r][col] === num) return false;
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let r = boxRow; r < boxRow + 3; r++) {
      for (let c = boxCol; c < boxCol + 3; c++) {
        if (grid[r][c] === num) return false;
      }
    }
    return true;
  }
}
