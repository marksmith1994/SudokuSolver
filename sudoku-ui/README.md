# Sudoku Solver UI

A modern Angular application with Tailwind CSS for solving Sudoku puzzles using multiple algorithms.

## Features

- **Interactive Sudoku Board**: Click to enter numbers or clear the board
- **File Upload**: Load puzzles from text files
- **Multiple Algorithms**: Choose from 6 different solving algorithms
- **Algorithm Comparison**: Compare performance across all algorithms
- **Real-time Results**: See solving times and solutions
- **Modern UI**: Beautiful, responsive design with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)

### Installation

1. Navigate to the sudoku-ui directory:
   ```bash
   cd sudoku-ui
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:4200`

## Usage

### Manual Input
1. Click on any cell in the Sudoku board
2. Enter a number (1-9) or leave empty for blank cells
3. Use the "Clear" button to reset the board
4. Use "Load Example" to try a sample puzzle

### File Upload
1. Create a text file with 9 lines, each containing 9 space-separated numbers
2. Use 0 for empty cells
3. Click "Upload Sudoku File" and select your file
4. Use "Download Example File" to see the correct format

### Solving
1. Select an algorithm from the dropdown
2. Choose whether to solve with one algorithm or compare all
3. Click the solve button
4. View results in the right panel

## File Format

Example Sudoku file (`sudoku-example.txt`):
```
5 3 0 0 7 0 0 0 0
6 0 0 1 9 5 0 0 0
0 9 8 0 0 0 0 6 0
8 0 0 0 6 0 0 0 3
4 0 0 8 0 3 0 0 1
7 0 0 0 2 0 0 0 6
0 6 0 0 0 0 2 8 0
0 0 0 4 1 9 0 0 5
0 0 0 0 8 0 0 7 9
```

## Algorithms

1. **Backtracking**: Classic recursive backtracking algorithm
2. **Constraint Propagation**: Uses constraint satisfaction techniques
3. **Dancing Links**: Donald Knuth's Algorithm X implementation
4. **Possibility Sort**: Sorts cells by number of possibilities
5. **Heuristic Backtracking**: Backtracking with intelligent cell selection
6. **Brute Force**: Exhaustive search (slow but guaranteed)

## Architecture

- **Angular 17**: Modern TypeScript framework
- **Tailwind CSS**: Utility-first CSS framework
- **Component-based**: Modular, reusable components
- **Service layer**: Handles business logic and API calls

## Next Steps

To integrate with your C# backend:

1. Create a Web API project in your C# solution
2. Expose endpoints for each algorithm
3. Update the `SudokuSolverService` to call your API instead of using mock data
4. Deploy both frontend and backend

## Development

- **Build**: `npm run build`
- **Test**: `npm test`
- **Watch**: `npm run watch` 