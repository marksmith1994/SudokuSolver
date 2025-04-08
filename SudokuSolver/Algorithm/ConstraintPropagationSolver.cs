using System;
using System.Diagnostics;
using System.Collections.Generic;

namespace SudokuSolver.Algorithm
{
    public class ConstraintPropagationSolver : BaseSolver
    {
        private const int Size = 9;
        private const int SubgridSize = 3;
        private HashSet<int>[,] possibilities;

        public override (bool solved, TimeSpan timeTaken) Solve(int[,] board)
        {
            var stopwatch = Stopwatch.StartNew();
            possibilities = InitializePossibilities(board);
            bool result = SolveWithConstraintPropagation(board);
            stopwatch.Stop();
            return (result, stopwatch.Elapsed);
        }

        private HashSet<int>[,] InitializePossibilities(int[,] board)
        {
            var possibilities = new HashSet<int>[Size, Size];
            for (int row = 0; row < Size; row++)
            {
                for (int col = 0; col < Size; col++)
                {
                    possibilities[row, col] = new HashSet<int>();
                    if (board[row, col] == 0)
                    {
                        for (int num = 1; num <= Size; num++)
                        {
                            possibilities[row, col].Add(num);
                        }
                    }
                    else
                    {
                        possibilities[row, col].Add(board[row, col]);
                    }
                }
            }
            return possibilities;
        }

        private bool SolveWithConstraintPropagation(int[,] board)
        {
            bool changed;
            do
            {
                changed = false;
                for (int row = 0; row < Size; row++)
                {
                    for (int col = 0; col < Size; col++)
                    {
                        if (board[row, col] == 0 && possibilities[row, col].Count == 1)
                        {
                            int num = possibilities[row, col].First();
                            board[row, col] = num;
                            if (!PropagateConstraints(board, row, col, num))
                                return false;
                            changed = true;
                        }
                    }
                }
            } while (changed);

            return SolveWithBacktracking(board);
        }

        private bool SolveWithBacktracking(int[,] board)
        {
            for (int row = 0; row < Size; row++)
            {
                for (int col = 0; col < Size; col++)
                {
                    if (board[row, col] == 0)
                    {
                        foreach (int num in possibilities[row, col])
                        {
                            if (IsValid(board, row, col, num))
                            {
                                board[row, col] = num;
                                if (SolveWithBacktracking(board))
                                    return true;
                                board[row, col] = 0;
                            }
                        }
                        return false;
                    }
                }
            }
            return true;
        }

        private bool PropagateConstraints(int[,] board, int row, int col, int num)
        {
            // Remove num from possibilities in same row
            for (int c = 0; c < Size; c++)
            {
                if (c != col && !RemovePossibility(board, row, c, num))
                    return false;
            }

            // Remove num from possibilities in same column
            for (int r = 0; r < Size; r++)
            {
                if (r != row && !RemovePossibility(board, r, col, num))
                    return false;
            }

            // Remove num from possibilities in same subgrid
            int startRow = row - row % SubgridSize;
            int startCol = col - col % SubgridSize;
            for (int r = 0; r < SubgridSize; r++)
            {
                for (int c = 0; c < SubgridSize; c++)
                {
                    int actualRow = startRow + r;
                    int actualCol = startCol + c;
                    if (actualRow != row && actualCol != col && !RemovePossibility(board, actualRow, actualCol, num))
                        return false;
                }
            }

            return true;
        }

        private bool RemovePossibility(int[,] board, int row, int col, int num)
        {
            if (board[row, col] != 0) return true;
            possibilities[row, col].Remove(num);
            if (possibilities[row, col].Count == 0) return false;
            if (possibilities[row, col].Count == 1)
            {
                int onlyNum = possibilities[row, col].First();
                board[row, col] = onlyNum;
                return PropagateConstraints(board, row, col, onlyNum);
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