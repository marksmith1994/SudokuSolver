# Sudoku Solver

This project is a C# console application designed to solve Sudoku puzzles using various algorithms. It allows users to input their own puzzles or use a default one, solve them with a selected algorithm, and compare the performance of different solving strategies.

## Features

*   Solve Sudoku puzzles using multiple algorithms.
*   Input custom Sudoku boards or use a built-in default puzzle.
*   Compare the execution time of different algorithms on the same puzzle.
*   Clear console display of the initial and solved boards.
*   Includes basic unit tests for each solver.

## Algorithms Implemented

The following Sudoku solving algorithms are included:

1.  **Backtracking:** A standard recursive algorithm that tries filling digits and backtracks when it hits a dead end.
2.  **Constraint Propagation:** Enhances backtracking by deducing values based on constraints before resorting to guessing.
3.  **Dancing Links (Algorithm X):** An efficient exact cover algorithm adapted for Sudoku.
4.  **Possibility Sort:** A custom backtracking approach that sorts empty cells based on the number of possible values they can take (least first) before filling.
5.  **Heuristic Backtracking:** A backtracking approach that uses heuristics (like minimum remaining values, degree heuristic, position) to guide the cell selection process.
6.  **Brute Force:** A simple backtracking implementation without specific optimizations or ordering heuristics.

*Note: All algorithms inheriting from `BaseSolver` now include a check to ensure the initial input board doesn't contain immediate conflicts.*

## Getting Started

### Prerequisites

*   .NET SDK (Version 8.0 or later recommended)

### Running the Application

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd SudokuSolver
    ```
2.  Build the project:
    ```bash
    dotnet build
    ```
3.  Run the application:
    ```bash
    dotnet run --project SudokuSolver
    ```

Follow the on-screen prompts to:
*   Choose between solving a single Sudoku or comparing algorithms.
*   Select the algorithm(s) to use.
*   Decide whether to use the default board or input a custom 9x9 board (using 0 for empty cells).

## Testing

The solution includes a unit test project (`SudokuSolver.Tests`) using the xUnit framework.

To run the tests:

1.  Navigate to the solution root directory (`SudokuSolver`).
2.  Run the following command:
    ```bash
    dotnet test
    ```

## Project Structure

*   `SudokuSolver/`: Contains the main console application logic (`Program.cs`).
*   `SudokuSolver/Algorithm/`: Contains the interface (`ISudokuSolver.cs`), base class (`BaseSolver.cs`), and implementations for each solving algorithm.
*   `SudokuSolver.Tests/`: Contains the xUnit tests for the solvers. Includes a base class (`SudokuSolverTestBase.cs`) for common test data and helpers.
*   `.gitignore`: Specifies intentionally untracked files that Git should ignore.
*   `README.md`: This file.
*   `SudokuSolver.sln`: The solution file.
*   `SudokuSolver/SudokuSolver.csproj`: The main project file.
*   `SudokuSolver.Tests/SudokuSolver.Tests.csproj`: The test project file.
