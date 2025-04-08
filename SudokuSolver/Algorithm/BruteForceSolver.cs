using System;
using System.Diagnostics;

namespace SudokuSolver.Algorithm
{
    public class BruteForceSolver : BaseSolver
    {
        private const int Size = 9;
        private const int SubgridSize = 3;

        public override (bool solved, TimeSpan timeTaken) Solve(int[,] board)
        {
            var stopwatch = Stopwatch.StartNew();
            bool result = SolveBruteForce(board);
            stopwatch.Stop();
            return (result, stopwatch.Elapsed);
        }

        private bool SolveBruteForce(int[,] board)
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
                                if (SolveBruteForce(board))
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

        private bool IsValid(int[,] board, int row, int col, int num)
        {
            // Check row
            for (int x = 0; x < Size; x++)
            {
                if (board[row, x] == num)
                {
                    return false;
                }
            }

            // Check column
            for (int x = 0; x < Size; x++)
            {
                if (board[x, col] == num)
                {
                    return false;
                }
            }

            // Check subgrid
            int startRow = row - row % SubgridSize;
            int startCol = col - col % SubgridSize;
            for (int r = 0; r < SubgridSize; r++)
            {
                for (int c = 0; c < SubgridSize; c++)
                {
                    if (board[startRow + r, startCol + c] == num)
                    {
                        return false;
                    }
                }
            }

            return true;
        }
    }
} 