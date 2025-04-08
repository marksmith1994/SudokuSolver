using System;
using System.Diagnostics;
using System.Collections.Generic;

namespace SudokuSolver.Algorithm
{
    public class BubbleSort : BaseSolver
    {
        public override (bool solved, TimeSpan timeTaken) Solve(int[,] board)
        {
            var stopwatch = Stopwatch.StartNew();
            bool result = SolveSudoku(board);
            stopwatch.Stop();
            return (result, stopwatch.Elapsed);
        }

        private bool SolveSudoku(int[,] board)
        {
            // Get all empty cells
            var emptyCells = GetEmptyCells(board);
            int n = emptyCells.Count;

            // Sort empty cells by number of possible values (ascending)
            for (int i = 0; i < n - 1; i++)
            {
                for (int j = 0; j < n - i - 1; j++)
                {
                    var currentCell = emptyCells[j];
                    var nextCell = emptyCells[j + 1];
                    
                    int currentPossibilities = CountPossibleValues(board, currentCell.row, currentCell.col);
                    int nextPossibilities = CountPossibleValues(board, nextCell.row, nextCell.col);

                    if (currentPossibilities > nextPossibilities)
                    {
                        // Swap cells
                        var temp = emptyCells[j];
                        emptyCells[j] = emptyCells[j + 1];
                        emptyCells[j + 1] = temp;
                    }
                }
            }

            // Try to solve starting with cells that have the fewest possibilities
            return SolveWithSortedCells(board, emptyCells);
        }

        private List<(int row, int col)> GetEmptyCells(int[,] board)
        {
            var emptyCells = new List<(int row, int col)>();
            for (int row = 0; row < Size; row++)
            {
                for (int col = 0; col < Size; col++)
                {
                    if (board[row, col] == 0)
                    {
                        emptyCells.Add((row, col));
                    }
                }
            }
            return emptyCells;
        }

        private int CountPossibleValues(int[,] board, int row, int col)
        {
            int count = 0;
            for (int num = 1; num <= Size; num++)
            {
                if (IsValid(board, row, col, num))
                {
                    count++;
                }
            }
            return count;
        }

        private bool SolveWithSortedCells(int[,] board, List<(int row, int col)> emptyCells)
        {
            if (emptyCells.Count == 0)
            {
                return true;
            }

            var (row, col) = emptyCells[0];
            emptyCells.RemoveAt(0);

            for (int num = 1; num <= Size; num++)
            {
                if (IsValid(board, row, col, num))
                {
                    board[row, col] = num;

                    if (SolveWithSortedCells(board, emptyCells))
                    {
                        return true;
                    }

                    board[row, col] = 0;
                }
            }

            emptyCells.Insert(0, (row, col));
            return false;
        }
    }
} 