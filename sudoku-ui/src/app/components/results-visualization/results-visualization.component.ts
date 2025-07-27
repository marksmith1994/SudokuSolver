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
    console.log('Visualization component initialized');
    this.puzzle = this.puzzleService.getCurrentPuzzle();
    console.log('Current puzzle:', this.puzzle);
    this.initializeVisualizations();
  }

  ngOnDestroy(): void {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }

  initializeVisualizations(): void {
    console.log('Initializing visualizations...');
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
      totalSteps: 0
    }));

    this.selectedAlgorithm = this.algorithms[0]?.algorithm || null;
    console.log('Algorithms initialized:', this.algorithms.length);
    this.loadVisualizationData();
  }

  async loadVisualizationData(): Promise<void> {
    try {
      console.log('Loading visualization data...');
      // For now, we'll simulate the visualization data
      // In a real implementation, this would come from the API
      this.algorithms.forEach(algorithm => {
        algorithm.steps = this.generateSimulatedSteps(algorithm.algorithm);
        algorithm.totalSteps = algorithm.steps.length;
        console.log(`Algorithm ${algorithm.algorithm} has ${algorithm.totalSteps} steps`);
      });

      this.maxSteps = Math.max(...this.algorithms.map(a => a.totalSteps));
      console.log('Max steps:', this.maxSteps);
      
      // Auto-start the visualization after a short delay
      setTimeout(() => {
        console.log('Auto-starting visualization...');
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

    return steps;
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
    console.log('Starting all algorithms...');
    this.isGlobalPlaying = true;
    this.algorithms.forEach(alg => {
      alg.isPlaying = true;
      console.log(`Algorithm ${alg.algorithm} has ${alg.totalSteps} steps`);
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
          console.log(`Algorithm ${alg.algorithm} at step ${alg.currentStep}/${alg.totalSteps}`);
        }

        // Stop if reached the end
        if (alg.currentStep >= alg.totalSteps) {
          alg.isPlaying = false;
          console.log(`Algorithm ${alg.algorithm} finished`);
        }
      }
    });

    // Check if any algorithms are still playing
    const anyPlaying = this.algorithms.some(alg => alg.isPlaying);
    if (anyPlaying) {
      this.animationFrame = requestAnimationFrame((time) => this.animate(time));
    } else {
      this.isGlobalPlaying = false;
      console.log('All algorithms finished');
    }
  }

  // Utility methods
  getCurrentBoard(algorithm: string): number[][] {
    const alg = this.algorithms.find(a => a.algorithm === algorithm);
    if (alg && alg.steps[alg.currentStep]) {
      return alg.steps[alg.currentStep].board;
    }
    return this.puzzle;
  }

  getCurrentDescription(algorithm: string): string {
    const alg = this.algorithms.find(a => a.algorithm === algorithm);
    if (alg && alg.steps[alg.currentStep]) {
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
} 