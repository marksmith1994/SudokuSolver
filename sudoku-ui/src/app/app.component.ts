import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './services/api.service';
import { PuzzleService } from './services/puzzle.service';
import { SolveResult } from './components/results-display/results-display.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Sudoku Solver';
  currentBoard: number[][] = this.createEmptyBoard();
  results: SolveResult[] = [];
  isSolving = false;

  constructor(
    private apiService: ApiService,
    private puzzleService: PuzzleService,
    private router: Router
  ) {}

  createEmptyBoard(): number[][] {
    return Array(9).fill(null).map(() => Array(9).fill(0));
  }

  onBoardChange(board: number[][]): void {
    this.currentBoard = board;
    this.puzzleService.setPuzzle(board);
  }

  onFileLoaded(board: number[][]): void {
    this.currentBoard = board;
    this.puzzleService.setPuzzle(board);
  }

  onSolveRequest(request: {algorithm: string, compareAll: boolean}): void {
    console.log('Solve request:', request);
    if (request.compareAll) {
      // Navigate to visualization page for algorithm comparison
      console.log('Navigating to visualization page...');
      this.router.navigate(['/visualization']);
    } else {
      // Single algorithm solve - show results in the sidebar
      this.isSolving = true;
      this.results = [];
      
      this.apiService.solvePuzzle(this.currentBoard, request.algorithm).subscribe({
        next: (result) => {
          this.results = [result];
          this.isSolving = false;
        },
        error: (error) => {
          console.error('Error solving puzzle:', error);
          this.isSolving = false;
        }
      });
    }
  }
} 