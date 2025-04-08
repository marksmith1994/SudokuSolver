using System;
using System.Diagnostics;

namespace SudokuSolver.Algorithm
{
    public class BacktrackingSolver : BaseSolver
    {
        public override (bool solved, TimeSpan timeTaken) Solve(int[,] board)
        {
            var stopwatch = Stopwatch.StartNew();

            // Check if the initial board is valid
            if (!IsBoardInitiallyValid(board))
            {
                stopwatch.Stop();
                return (false, stopwatch.Elapsed); // Return immediately if invalid
            }

            bool result = SolveSudoku(board);
            stopwatch.Stop();
            return (result, stopwatch.Elapsed);
        }

        private bool SolveSudoku(int[,] board)
        {
            for (int row = 0; row < Size; row++)
            {
                for (int col = 0; col < Size; col++)
                {
                    if (board[row, col] == 0)
                    {
                        for (int num = 1; num <= Size; num++)
                        {
                            if (IsValid(board, row, col, num))
                            {
                                board[row, col] = num;

                                if (SolveSudoku(board))
                                {
                                    return true;
                                }

                                board[row, col] = 0;
                            }
                        }
                        return false;
                    }
                }
            }
            return true;
        }
    }
} 