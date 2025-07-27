import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {
  @Output() boardLoaded = new EventEmitter<number[][]>();

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        try {
          const content = e.target.result;
          const board = this.parseSudokuFile(content);
          if (board) {
            this.boardLoaded.emit(board);
          }
        } catch (error) {
          alert('Error reading file. Please ensure it contains a valid 9x9 Sudoku puzzle.');
        }
      };
      reader.readAsText(file);
    }
  }

  private parseSudokuFile(content: string): number[][] | null {
    const lines = content.trim().split('\n');
    if (lines.length !== 9) {
      return null;
    }

    const board: number[][] = [];
    for (const line of lines) {
      const row = line.trim().split(/\s+/).map(num => {
        const value = parseInt(num, 10);
        return isNaN(value) || value < 0 || value > 9 ? 0 : value;
      });
      
      if (row.length !== 9) {
        return null;
      }
      board.push(row);
    }

    return board;
  }

  downloadExample(): void {
    const exampleContent = `5 3 0 0 7 0 0 0 0
6 0 0 1 9 5 0 0 0
0 9 8 0 0 0 0 6 0
8 0 0 0 6 0 0 0 3
4 0 0 8 0 3 0 0 1
7 0 0 0 2 0 0 0 6
0 6 0 0 0 0 2 8 0
0 0 0 4 1 9 0 0 5
0 0 0 0 8 0 0 7 9`;

    const blob = new Blob([exampleContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sudoku-example.txt';
    a.click();
    window.URL.revokeObjectURL(url);
  }
} 