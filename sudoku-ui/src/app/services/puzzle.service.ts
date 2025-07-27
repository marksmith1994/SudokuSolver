import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PuzzleService {
  private currentPuzzleSubject = new BehaviorSubject<number[][]>(this.getDefaultPuzzle());
  public currentPuzzle$ = this.currentPuzzleSubject.asObservable();

  constructor() {}

  setPuzzle(puzzle: number[][]): void {
    this.currentPuzzleSubject.next(puzzle);
  }

  getCurrentPuzzle(): number[][] {
    return this.currentPuzzleSubject.value;
  }

  private getDefaultPuzzle(): number[][] {
    return [
      [5, 3, 0, 0, 7, 0, 0, 0, 0],
      [6, 0, 0, 1, 9, 5, 0, 0, 0],
      [0, 9, 8, 0, 0, 0, 0, 6, 0],
      [8, 0, 0, 0, 6, 0, 0, 0, 3],
      [4, 0, 0, 8, 0, 3, 0, 0, 1],
      [7, 0, 0, 0, 2, 0, 0, 0, 6],
      [0, 6, 0, 0, 0, 0, 2, 8, 0],
      [0, 0, 0, 4, 1, 9, 0, 0, 5],
      [0, 0, 0, 0, 8, 0, 0, 7, 9]
    ];
  }
} 