import { Component, EventEmitter, Input, Output, HostListener } from '@angular/core';

@Component({
  selector: 'app-sudoku-board',
  templateUrl: './sudoku-board.component.html',
  styleUrls: ['./sudoku-board.component.css']
})
export class SudokuBoardComponent {
  @Input() board: number[][] = this.createEmptyBoard();
  @Output() boardChange = new EventEmitter<number[][]>();
  
  showPresets = false;
  hoveredCell: {row: number, col: number} | null = null;

  createEmptyBoard(): number[][] {
    return Array(9).fill(null).map(() => Array(9).fill(0));
  }

  onCellChange(row: number, col: number, value: any): void {
    // Handle both string and number inputs
    let numValue: number;
    if (typeof value === 'string') {
      numValue = value === '' ? 0 : parseInt(value, 10);
    } else {
      numValue = value || 0;
    }
    
    // Ensure the value is within valid range
    if (numValue >= 0 && numValue <= 9) {
      this.board[row][col] = numValue;
      this.boardChange.emit(this.board);
    }
  }

  clearBoard(): void {
    this.board = this.createEmptyBoard();
    this.boardChange.emit(this.board);
  }

  // Preset Sudoku puzzles
  private readonly presetPuzzles = {
    classic: [
      [5, 3, 0, 0, 7, 0, 0, 0, 0],
      [6, 0, 0, 1, 9, 5, 0, 0, 0],
      [0, 9, 8, 0, 0, 0, 0, 6, 0],
      [8, 0, 0, 0, 6, 0, 0, 0, 3],
      [4, 0, 0, 8, 0, 3, 0, 0, 1],
      [7, 0, 0, 0, 2, 0, 0, 0, 6],
      [0, 6, 0, 0, 0, 0, 2, 8, 0],
      [0, 0, 0, 4, 1, 9, 0, 0, 5],
      [0, 0, 0, 0, 8, 0, 0, 7, 9]
    ],
    easy: [
      [0, 0, 0, 2, 6, 0, 7, 0, 1],
      [6, 8, 0, 0, 7, 0, 0, 9, 0],
      [1, 9, 0, 0, 0, 4, 5, 0, 0],
      [8, 2, 0, 1, 0, 0, 0, 4, 0],
      [0, 0, 4, 6, 0, 2, 9, 0, 0],
      [0, 5, 0, 0, 0, 3, 0, 2, 8],
      [0, 0, 9, 3, 0, 0, 0, 7, 4],
      [0, 4, 0, 0, 5, 0, 0, 3, 6],
      [7, 0, 3, 0, 1, 8, 0, 0, 0]
    ],
    medium: [
      [0, 0, 0, 6, 0, 0, 4, 0, 0],
      [7, 0, 0, 0, 0, 3, 6, 0, 0],
      [0, 0, 0, 0, 9, 1, 0, 8, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 5, 0, 1, 8, 0, 0, 0, 3],
      [0, 0, 0, 3, 0, 6, 0, 4, 5],
      [0, 4, 0, 2, 0, 0, 0, 6, 0],
      [9, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    hard: [
      [0, 0, 0, 0, 0, 0, 0, 1, 2],
      [0, 0, 0, 0, 3, 5, 0, 0, 0],
      [0, 0, 0, 6, 0, 0, 0, 7, 0],
      [7, 0, 0, 0, 0, 0, 3, 0, 0],
      [0, 0, 0, 4, 0, 0, 8, 0, 0],
      [1, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 2, 0, 0, 0, 0],
      [0, 8, 0, 0, 0, 0, 0, 4, 0],
      [0, 5, 0, 0, 0, 0, 6, 0, 0]
    ]
  };

  loadDefaultPuzzle(): void {
    this.board = this.presetPuzzles.classic.map(row => [...row]);
    this.boardChange.emit(this.board);
  }

  loadEasyPuzzle(): void {
    this.board = this.presetPuzzles.easy.map(row => [...row]);
    this.boardChange.emit(this.board);
  }

  loadMediumPuzzle(): void {
    this.board = this.presetPuzzles.medium.map(row => [...row]);
    this.boardChange.emit(this.board);
  }

  loadHardPuzzle(): void {
    this.board = this.presetPuzzles.hard.map(row => [...row]);
    this.boardChange.emit(this.board);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    // Close dropdown if clicking outside
    const target = event.target as HTMLElement;
    if (!target.closest('.relative')) {
      this.showPresets = false;
    }
  }

  getCellClass(row: number, col: number): string {
    let classes = 'w-16 h-16 text-center border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 relative';
    
    // Add hover effect
    classes += ' hover:bg-blue-50 hover:border-blue-300';
    
    // Add focus effect
    classes += ' focus:bg-blue-50 focus:border-blue-400';
    
    // Add section highlighting
    if (this.hoveredCell && this.isInSameSection(row, col, this.hoveredCell.row, this.hoveredCell.col)) {
      classes += ' bg-blue-50 border-blue-300';
    }
    
    return classes;
  }

  getBorderOverlayClass(row: number, col: number): string {
    let classes = 'absolute inset-0 pointer-events-none';
    
    // Add thicker borders for 3x3 grid sections
    if (row % 3 === 0) classes += ' border-t-2 border-t-gray-400';
    if (row === 8) classes += ' border-b-2 border-b-gray-400';
    if (col % 3 === 0) classes += ' border-l-2 border-l-gray-400';
    if (col === 8) classes += ' border-r-2 border-r-gray-400';
    
    return classes;
  }

  getCellPlaceholder(row: number, col: number): string {
    // Show subtle placeholder for empty cells
    return this.board[row][col] === 0 ? '·' : '';
  }

  isInSameSection(row1: number, col1: number, row2: number, col2: number): boolean {
    const sectionRow1 = Math.floor(row1 / 3);
    const sectionCol1 = Math.floor(col1 / 3);
    const sectionRow2 = Math.floor(row2 / 3);
    const sectionCol2 = Math.floor(col2 / 3);
    return sectionRow1 === sectionRow2 && sectionCol1 === sectionCol2;
  }

  onCellHover(row: number, col: number): void {
    this.hoveredCell = { row, col };
  }

  onCellLeave(): void {
    this.hoveredCell = null;
  }
} 