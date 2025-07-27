import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { SolveResult } from '../components/results-display/results-display.component';

@Injectable({
  providedIn: 'root'
})
export class SudokuSolverService {

  constructor() { }

  // Mock implementation - in a real app, this would call your C# backend API
  solvePuzzle(board: number[][], algorithm: string): Observable<SolveResult> {
    // Simulate API call delay
    return of(this.mockSolve(board, algorithm)).pipe(delay(500 + Math.random() * 1000));
  }

  compareAlgorithms(board: number[][]): Observable<SolveResult[]> {
    const algorithms = [
      'Backtracking',
      'Constraint Propagation', 
      'Dancing Links',
      'Possibility Sort',
      'Heuristic Backtracking',
      'Brute Force'
    ];

    const results = algorithms.map(algo => this.mockSolve(board, algo));
    return of(results).pipe(delay(1000 + Math.random() * 2000));
  }

  private mockSolve(board: number[][], algorithm: string): SolveResult {
    // This is a mock implementation
    // In reality, you'd call your C# backend API here
    
    const startTime = performance.now();
    
    // Simulate solving time based on algorithm
    const solveTimes = {
      'Backtracking': 50,
      'Constraint Propagation': 30,
      'Dancing Links': 25,
      'Possibility Sort': 40,
      'Heuristic Backtracking': 35,
      'Brute Force': 200
    };

    const baseTime = solveTimes[algorithm as keyof typeof solveTimes] || 50;
    const randomFactor = 0.5 + Math.random();
    const simulatedTime = baseTime * randomFactor;

    // Simulate 95% success rate
    const solved = Math.random() > 0.05;
    
    const result: SolveResult = {
      algorithm,
      solved,
      timeMs: simulatedTime
    };

    if (solved) {
      // Generate a mock solution (this would come from your C# solver)
      result.solution = this.generateMockSolution(board);
    }

    return result;
  }

  private generateMockSolution(board: number[][]): number[][] {
    // This is a very simple mock solution generator
    // In reality, your C# solver would provide the actual solution
    const solution = board.map(row => [...row]);
    
    // Fill empty cells with random valid numbers (1-9)
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (solution[i][j] === 0) {
          solution[i][j] = Math.floor(Math.random() * 9) + 1;
        }
      }
    }
    
    return solution;
  }
} 