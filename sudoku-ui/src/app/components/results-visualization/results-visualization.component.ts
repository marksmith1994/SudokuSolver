import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { PuzzleService } from '../../services/puzzle.service';
import { SolveResult } from '../results-display/results-display.component';

export interface VisualizationStep {
  algorithm: string;
  step: number;
  board: number[][];
  description: string;
  cellChanges: { row: number; col: number; value: number; type: 'fill' | 'remove' | 'highlight' }[];
  timestamp: number;
}

export interface AlgorithmVisualization {
  algorithm: string;
  steps: VisualizationStep[];
  currentStep: number;
  isPlaying: boolean;
  speed: number; // steps per second
  totalSteps: number;
  startTime?: number;
  endTime?: number;
  isCompleted: boolean;
  position?: number;
}

@Component({
  selector: 'app-results-visualization',
  templateUrl: './results-visualization.component.html',
  styleUrls: ['./results-visualization.component.css']
})
export class ResultsVisualizationComponent implements OnInit, OnDestroy {
  @Input() puzzle: number[][] = [];
  
  algorithms: AlgorithmVisualization[] = [];
  selectedAlgorithm: string | null = null;
  globalSpeed: number = 2; // steps per second
  isGlobalPlaying: boolean = false;
  currentTime: number = 0;
  maxSteps: number = 0;
  
  private animationFrame: number | null = null;
  private lastTimestamp: number = 0;

  constructor(
    private apiService: ApiService,
    private puzzleService: PuzzleService
  ) {}

  ngOnInit(): void {
    this.puzzle = this.puzzleService.getCurrentPuzzle();
    this.initializeVisualizations();
  }

  ngOnDestroy(): void {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }

  initializeVisualizations(): void {
    // Initialize all algorithms with empty steps
    const algorithmNames = [
      'backtracking',
      'constraint-propagation', 
      'dancing-links',
      'possibility-sort',
      'heuristic-backtracking',
      'brute-force'
    ];

    this.algorithms = algorithmNames.map(name => ({
      algorithm: name,
      steps: [],
      currentStep: 0,
      isPlaying: false,
      speed: this.globalSpeed,
      totalSteps: 0,
      isCompleted: false
    }));

    this.selectedAlgorithm = this.algorithms[0]?.algorithm || null;
    this.loadVisualizationData();
  }

  async loadVisualizationData(): Promise<void> {
    try {
      // For now, we'll simulate the visualization data
      // In a real implementation, this would come from the API
      this.algorithms.forEach(algorithm => {
        algorithm.steps = this.generateSimulatedSteps(algorithm.algorithm);
        algorithm.totalSteps = algorithm.steps.length;
      });

      this.maxSteps = Math.max(...this.algorithms.map(a => a.totalSteps));
      
      // Auto-start the visualization after a short delay
      setTimeout(() => {
        this.playAll();
      }, 1000);
    } catch (error) {
      console.error('Error loading visualization data:', error);
    }
  }

  generateSimulatedSteps(algorithm: string): VisualizationStep[] {
    const steps: VisualizationStep[] = [];
    const board = this.puzzle.map(row => [...row]);
    let stepNumber = 0;

    // Simulate different solving patterns for each algorithm
    const patterns = this.getAlgorithmPattern(algorithm);
    
    patterns.forEach((pattern, index) => {
      stepNumber++;
      const step: VisualizationStep = {
        algorithm,
        step: stepNumber,
        board: board.map(row => [...row]),
        description: pattern.description,
        cellChanges: pattern.changes,
        timestamp: Date.now() + (stepNumber * 100)
      };

      // Apply changes to the board
      pattern.changes.forEach((change: { row: number; col: number; value: number; type: string }) => {
        board[change.row][change.col] = change.value;
      });

      steps.push(step);
    });

    // Add final completed solution step
    const completedBoard = this.getCompletedSolution();
    const finalStep: VisualizationStep = {
      algorithm,
      step: stepNumber + 1,
      board: completedBoard,
      description: 'Puzzle solved! Complete solution found.',
      cellChanges: [],
      timestamp: Date.now() + ((stepNumber + 1) * 100)
    };
    steps.push(finalStep);

    return steps;
  }

  private getCompletedSolution(): number[][] {
    // This is a sample completed Sudoku solution
    // In a real implementation, this would be the actual solution
    return [
      [5, 3, 4, 6, 7, 8, 9, 1, 2],
      [6, 7, 2, 1, 9, 5, 3, 4, 8],
      [1, 9, 8, 3, 4, 2, 5, 6, 7],
      [8, 5, 9, 7, 6, 1, 4, 2, 3],
      [4, 2, 6, 8, 5, 3, 7, 9, 1],
      [7, 1, 3, 9, 2, 4, 8, 5, 6],
      [9, 6, 1, 5, 3, 7, 2, 8, 4],
      [2, 8, 7, 4, 1, 9, 6, 3, 5],
      [3, 4, 5, 2, 8, 6, 1, 7, 9]
    ];
  }

  getAlgorithmPattern(algorithm: string): any[] {
    // Simulate different solving patterns for each algorithm
    const patterns: { [key: string]: any[] } = {
      'backtracking': [
        { description: 'Starting backtracking search...', changes: [] },
        { description: 'Trying value 1 in cell (0,2)', changes: [{ row: 0, col: 2, value: 1, type: 'fill' }] },
        { description: 'Checking constraints...', changes: [] },
        { description: 'Value 1 is valid, moving to next cell', changes: [] },
        { description: 'Trying value 4 in cell (0,3)', changes: [{ row: 0, col: 3, value: 4, type: 'fill' }] },
        { description: 'Conflict detected, backtracking...', changes: [{ row: 0, col: 3, value: 0, type: 'remove' }] },
        { description: 'Trying value 7 in cell (0,3)', changes: [{ row: 0, col: 3, value: 7, type: 'fill' }] },
        { description: 'Filling cell (1,1) with 5', changes: [{ row: 1, col: 1, value: 5, type: 'fill' }] },
        { description: 'Filling cell (2,4) with 8', changes: [{ row: 2, col: 4, value: 8, type: 'fill' }] },
        { description: 'Filling cell (3,1) with 2', changes: [{ row: 3, col: 1, value: 2, type: 'fill' }] },
        { description: 'Filling cell (4,4) with 9', changes: [{ row: 4, col: 4, value: 9, type: 'fill' }] },
        { description: 'Solution found!', changes: [] }
      ],
      'constraint-propagation': [
        { description: 'Initializing constraint propagation...', changes: [] },
        { description: 'Propagating row constraints...', changes: [] },
        { description: 'Propagating column constraints...', changes: [] },
        { description: 'Propagating box constraints...', changes: [] },
        { description: 'Filling single candidate (1,1) = 5', changes: [{ row: 1, col: 1, value: 5, type: 'fill' }] },
        { description: 'Updating constraints...', changes: [] },
        { description: 'Filling single candidate (2,4) = 8', changes: [{ row: 2, col: 4, value: 8, type: 'fill' }] },
        { description: 'Filling single candidate (3,1) = 2', changes: [{ row: 3, col: 1, value: 2, type: 'fill' }] },
        { description: 'Filling single candidate (4,4) = 9', changes: [{ row: 4, col: 4, value: 9, type: 'fill' }] },
        { description: 'Filling single candidate (5,7) = 3', changes: [{ row: 5, col: 7, value: 3, type: 'fill' }] },
        { description: 'Solution complete!', changes: [] }
      ],
      'dancing-links': [
        { description: 'Building exact cover matrix...', changes: [] },
        { description: 'Creating dancing links structure...', changes: [] },
        { description: 'Starting Algorithm X...', changes: [] },
        { description: 'Selecting constraint row...', changes: [] },
        { description: 'Covering related constraints...', changes: [] },
        { description: 'Filling cell (0,2) = 1', changes: [{ row: 0, col: 2, value: 1, type: 'fill' }] },
        { description: 'Filling cell (1,1) = 5', changes: [{ row: 1, col: 1, value: 5, type: 'fill' }] },
        { description: 'Filling cell (2,4) = 8', changes: [{ row: 2, col: 4, value: 8, type: 'fill' }] },
        { description: 'Filling cell (3,1) = 2', changes: [{ row: 3, col: 1, value: 2, type: 'fill' }] },
        { description: 'Solution found!', changes: [] }
      ],
      'possibility-sort': [
        { description: 'Calculating possibilities for each cell...', changes: [] },
        { description: 'Sorting cells by possibility count...', changes: [] },
        { description: 'Filling cell (1,1) with fewest possibilities = 5', changes: [{ row: 1, col: 1, value: 5, type: 'fill' }] },
        { description: 'Updating possibility counts...', changes: [] },
        { description: 'Filling cell (2,4) with fewest possibilities = 8', changes: [{ row: 2, col: 4, value: 8, type: 'fill' }] },
        { description: 'Filling cell (3,1) with fewest possibilities = 2', changes: [{ row: 3, col: 1, value: 2, type: 'fill' }] },
        { description: 'Filling cell (4,4) with fewest possibilities = 9', changes: [{ row: 4, col: 4, value: 9, type: 'fill' }] },
        { description: 'Solution complete!', changes: [] }
      ],
      'heuristic-backtracking': [
        { description: 'Analyzing puzzle structure...', changes: [] },
        { description: 'Identifying most constrained cells...', changes: [] },
        { description: 'Applying heuristics for cell selection...', changes: [] },
        { description: 'Filling most constrained cell (1,1) = 5', changes: [{ row: 1, col: 1, value: 5, type: 'fill' }] },
        { description: 'Checking heuristic constraints...', changes: [] },
        { description: 'Filling next constrained cell (2,4) = 8', changes: [{ row: 2, col: 4, value: 8, type: 'fill' }] },
        { description: 'Filling next constrained cell (3,1) = 2', changes: [{ row: 3, col: 1, value: 2, type: 'fill' }] },
        { description: 'Filling next constrained cell (4,4) = 9', changes: [{ row: 4, col: 4, value: 9, type: 'fill' }] },
        { description: 'Solution found using heuristics!', changes: [] }
      ],
      'brute-force': [
        { description: 'Starting exhaustive search...', changes: [] },
        { description: 'Trying combination 1...', changes: [{ row: 0, col: 2, value: 1, type: 'fill' }] },
        { description: 'Checking validity...', changes: [] },
        { description: 'Invalid, trying next combination...', changes: [{ row: 0, col: 2, value: 2, type: 'fill' }] },
        { description: 'Checking validity...', changes: [] },
        { description: 'Invalid, trying next combination...', changes: [{ row: 0, col: 2, value: 3, type: 'fill' }] },
        { description: 'Valid combination found!', changes: [] },
        { description: 'Filling cell (1,1) = 5', changes: [{ row: 1, col: 1, value: 5, type: 'fill' }] },
        { description: 'Filling cell (2,4) = 8', changes: [{ row: 2, col: 4, value: 8, type: 'fill' }] },
        { description: 'Filling cell (3,1) = 2', changes: [{ row: 3, col: 1, value: 2, type: 'fill' }] },
        { description: 'Solution complete!', changes: [] }
      ]
    };

    return patterns[algorithm] || [];
  }

  // Playback controls
  playAll(): void {
    // If all algorithms have finished, reset them first
    const allFinished = this.algorithms.every(alg => alg.currentStep >= alg.totalSteps);
    if (allFinished) {
      this.resetAll();
    }
    
    this.isGlobalPlaying = true;
    const startTime = Date.now();
    this.algorithms.forEach(alg => {
      alg.isPlaying = true;
      alg.startTime = startTime;
      alg.isCompleted = false;
      alg.endTime = undefined;
      alg.position = undefined;
    });
    this.startAnimation();
  }

  pauseAll(): void {
    this.isGlobalPlaying = false;
    this.algorithms.forEach(alg => alg.isPlaying = false);
    this.stopAnimation();
  }

  resetAll(): void {
    this.algorithms.forEach(alg => {
      alg.currentStep = 0;
      alg.isPlaying = false;
      alg.isCompleted = false;
      alg.startTime = undefined;
      alg.endTime = undefined;
      alg.position = undefined;
    });
    this.isGlobalPlaying = false;
    this.currentTime = 0;
    this.stopAnimation();
  }

  setSpeed(speed: number): void {
    this.globalSpeed = speed;
    this.algorithms.forEach(alg => alg.speed = speed);
  }

  // Individual algorithm controls
  playAlgorithm(algorithm: string): void {
    const alg = this.algorithms.find(a => a.algorithm === algorithm);
    if (alg) {
      // If this algorithm has finished, reset it first
      if (alg.currentStep >= alg.totalSteps) {
        alg.currentStep = 0;
      }
      alg.isPlaying = true;
      if (!this.isGlobalPlaying) {
        this.startAnimation();
      }
    }
  }

  pauseAlgorithm(algorithm: string): void {
    const alg = this.algorithms.find(a => a.algorithm === algorithm);
    if (alg) {
      alg.isPlaying = false;
    }
  }

  resetAlgorithm(algorithm: string): void {
    const alg = this.algorithms.find(a => a.algorithm === algorithm);
    if (alg) {
      alg.currentStep = 0;
      alg.isPlaying = false;
    }
  }

  // Animation loop
  private startAnimation(): void {
    this.lastTimestamp = performance.now();
    this.animate();
  }

  private stopAnimation(): void {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  private animate(currentTime: number = performance.now()): void {
    const deltaTime = currentTime - this.lastTimestamp;
    this.lastTimestamp = currentTime;

    // Update all playing algorithms
    this.algorithms.forEach(alg => {
      if (alg.isPlaying && alg.currentStep < alg.totalSteps) {
        const stepInterval = 1000 / alg.speed; // milliseconds per step
        this.currentTime += deltaTime;

        if (this.currentTime >= stepInterval) {
          alg.currentStep++;
          this.currentTime = 0;
        }

        // Stop if reached the end
        if (alg.currentStep >= alg.totalSteps) {
          alg.isPlaying = false;
          if (!alg.isCompleted) {
            alg.isCompleted = true;
            alg.endTime = Date.now();
            this.updatePositions();
          }
        }
      }
    });

    // Check if any algorithms are still playing
    const anyPlaying = this.algorithms.some(alg => alg.isPlaying);
    if (anyPlaying) {
      this.animationFrame = requestAnimationFrame((time) => this.animate(time));
    } else {
      this.isGlobalPlaying = false;
    }
  }

  // Utility methods
  getCurrentBoard(algorithm: string): number[][] {
    const alg = this.algorithms.find(a => a.algorithm === algorithm);
    if (alg && alg.steps.length > 0 && alg.currentStep < alg.steps.length) {
      return alg.steps[alg.currentStep].board;
    }
    // If algorithm is completed, show the final solution
    if (alg && alg.isCompleted) {
      return this.getCompletedSolution();
    }
    return this.puzzle;
  }

  getCurrentDescription(algorithm: string): string {
    const alg = this.algorithms.find(a => a.algorithm === algorithm);
    if (alg && alg.steps.length > 0 && alg.currentStep < alg.steps.length) {
      return alg.steps[alg.currentStep].description;
    }
    return 'Ready to start...';
  }

  getProgress(algorithm: string): number {
    const alg = this.algorithms.find(a => a.algorithm === algorithm);
    if (alg && alg.totalSteps > 0) {
      return (alg.currentStep / alg.totalSteps) * 100;
    }
    return 0;
  }

  formatAlgorithmName(algorithm: string): string {
    return algorithm.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  private updatePositions(): void {
    const completedAlgorithms = this.algorithms
      .filter(alg => alg.isCompleted && alg.endTime)
      .sort((a, b) => (a.endTime! - a.startTime!) - (b.endTime! - b.startTime!));

    completedAlgorithms.forEach((alg, index) => {
      alg.position = index + 1;
    });
  }

  getCompletionTime(algorithm: string): string {
    const alg = this.algorithms.find(a => a.algorithm === algorithm);
    if (alg && alg.isCompleted && alg.startTime && alg.endTime) {
      const timeMs = alg.endTime - alg.startTime;
      return `${timeMs}ms`;
    }
    return '';
  }

  getPosition(algorithm: string): string {
    const alg = this.algorithms.find(a => a.algorithm === algorithm);
    if (alg && alg.isCompleted && alg.position) {
      return `#${alg.position}`;
    }
    return '';
  }

  getMedalIcon(algorithm: string): string {
    const alg = this.algorithms.find(a => a.algorithm === algorithm);
    if (alg && alg.isCompleted && alg.position) {
      switch (alg.position) {
        case 1: return '🥇';
        case 2: return '🥈';
        case 3: return '🥉';
        default: return `#${alg.position}`;
      }
    }
    return '';
  }
} 