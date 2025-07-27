import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

export interface Algorithm {
  id: string;
  name: string;
  description: string;
}

@Component({
  selector: 'app-algorithm-selector',
  templateUrl: './algorithm-selector.component.html',
  styleUrls: ['./algorithm-selector.component.css']
})
export class AlgorithmSelectorComponent implements OnInit {
  @Output() solveRequest = new EventEmitter<{algorithm: string, compareAll: boolean}>();

  selectedAlgorithm = 'backtracking';
  compareAll = false;
  algorithms: Algorithm[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadAlgorithms();
  }

  loadAlgorithms(): void {
    this.apiService.getAlgorithms().subscribe({
      next: (algorithmIds) => {
        this.algorithms = algorithmIds.map(id => ({
          id: id,
          name: this.formatAlgorithmName(id),
          description: this.getAlgorithmDescription(id)
        }));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading algorithms:', error);
        this.error = 'Failed to load algorithms';
        this.isLoading = false;
        // Fallback to hardcoded algorithms
        this.algorithms = this.getFallbackAlgorithms();
      }
    });
  }

  private formatAlgorithmName(id: string): string {
    return id.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  private getAlgorithmDescription(id: string): string {
    const descriptions: { [key: string]: string } = {
      'backtracking': 'Classic recursive backtracking algorithm',
      'constraint-propagation': 'Uses constraint satisfaction techniques',
      'dancing-links': 'Donald Knuth\'s Algorithm X implementation',
      'possibility-sort': 'Sorts cells by number of possibilities',
      'heuristic-backtracking': 'Backtracking with intelligent cell selection',
      'brute-force': 'Exhaustive search (slow but guaranteed)'
    };
    return descriptions[id] || 'Algorithm for solving Sudoku puzzles';
  }

  private getFallbackAlgorithms(): Algorithm[] {
    return [
      {
        id: 'backtracking',
        name: 'Backtracking',
        description: 'Classic recursive backtracking algorithm'
      },
      {
        id: 'constraint-propagation',
        name: 'Constraint Propagation',
        description: 'Uses constraint satisfaction techniques'
      },
      {
        id: 'dancing-links',
        name: 'Dancing Links',
        description: 'Donald Knuth\'s Algorithm X implementation'
      },
      {
        id: 'possibility-sort',
        name: 'Possibility Sort',
        description: 'Sorts cells by number of possibilities'
      },
      {
        id: 'heuristic-backtracking',
        name: 'Heuristic Backtracking',
        description: 'Backtracking with intelligent cell selection'
      },
      {
        id: 'brute-force',
        name: 'Brute Force',
        description: 'Exhaustive search (slow but guaranteed)'
      }
    ];
  }

  solve(): void {
    console.log('Algorithm selector solve called');
    console.log('Selected algorithm:', this.selectedAlgorithm);
    console.log('Compare all:', this.compareAll);
    this.solveRequest.emit({
      algorithm: this.selectedAlgorithm,
      compareAll: this.compareAll
    });
  }

  getSelectedAlgorithmName(): string {
    const algorithm = this.algorithms.find(a => a.id === this.selectedAlgorithm);
    return algorithm?.name || 'Selected Algorithm';
  }

  getSelectedAlgorithmDescription(): string {
    const algorithm = this.algorithms.find(a => a.id === this.selectedAlgorithm);
    return algorithm?.description || '';
  }
} 