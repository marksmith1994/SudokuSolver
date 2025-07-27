import { Component, Input } from '@angular/core';

export interface SolveResult {
  algorithm: string;
  solved: boolean;
  timeMs: number;
  solution?: number[][];
}

@Component({
  selector: 'app-results-display',
  templateUrl: './results-display.component.html'
})
export class ResultsDisplayComponent {
  @Input() results: SolveResult[] = [];
  @Input() isSolving = false;

  get sortedResults(): SolveResult[] {
    return [...this.results].sort((a, b) => a.timeMs - b.timeMs);
  }

  get fastestResult(): SolveResult | null {
    return this.results.length > 0 ? this.sortedResults[0] : null;
  }

  formatTime(ms: number): string {
    if (ms < 1) return '< 1ms';
    if (ms < 1000) return `${ms.toFixed(1)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  }

  getStatusClass(result: SolveResult): string {
    return result.solved 
      ? 'text-green-600 bg-green-100' 
      : 'text-red-600 bg-red-100';
  }

  getStatusText(result: SolveResult): string {
    return result.solved ? 'Solved' : 'Failed';
  }
} 