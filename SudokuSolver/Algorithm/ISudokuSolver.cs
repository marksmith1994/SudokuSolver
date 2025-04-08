using System;

namespace SudokuSolver.Algorithm
{
    public interface ISudokuSolver
    {
        (bool solved, TimeSpan timeTaken) Solve(int[,] board);
    }
} 