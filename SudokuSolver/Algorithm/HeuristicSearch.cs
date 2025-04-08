using System;
using System.Diagnostics;
using System.Collections.Generic;
using System.Linq;

namespace SudokuSolver.Algorithm
{
    public class HeuristicSearch : BaseSolver
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
            // Get all empty cells with their possible values
            var emptyCells = GetEmptyCellsWithPossibilities(board);
            
            // Sort cells by heuristic score
            var sortedCells = emptyCells.OrderBy(cell => CalculateHeuristicScore(cell, emptyCells)).ToList();

            return SolveWithHeuristics(board, sortedCells);
        }

        private List<(int row, int col, List<int> possibleValues)> GetEmptyCellsWithPossibilities(int[,] board)
        {
            var cells = new List<(int row, int col, List<int> possibleValues)>();
            for (int row = 0; row < Size; row++)
            {
                for (int col = 0; col < Size; col++)
                {
                    if (board[row, col] == 0)
                    {
                        var possibleValues = new List<int>();
                        for (int num = 1; num <= Size; num++)
                        {
                            if (IsValid(board, row, col, num))
                            {
                                possibleValues.Add(num);
                            }
                        }
                        cells.Add((row, col, possibleValues));
                    }
                }
            }
            return cells;
        }

        private int CalculateHeuristicScore((int row, int col, List<int> possibleValues) cell, 
            List<(int row, int col, List<int> possibleValues)> allCells)
        {
            // Heuristic 1: Number of possible values (fewer is better)
            int possibleValuesScore = cell.possibleValues.Count * 10;

            // Heuristic 2: Position in the grid (center positions are more constrained)
            int positionScore = CalculatePositionScore(cell.row, cell.col);

            // Heuristic 3: Number of empty cells in the same row, column, and box
            int constraintScore = CalculateConstraintScore(cell.row, cell.col, allCells);

            // Combine heuristics with different weights
            return possibleValuesScore + positionScore + constraintScore;
        }

        private int CalculatePositionScore(int row, int col)
        {
            // Center positions (3,4,5) are more constrained
            int rowScore = Math.Abs(row - 4); // Distance from center row
            int colScore = Math.Abs(col - 4); // Distance from center column
            return (rowScore + colScore) * 2;
        }

        private int CalculateConstraintScore(int row, int col, List<(int row, int col, List<int> possibleValues)> allCells)
        {
            // Calculate how many empty cells are in the same row, column, and box
            int emptyCellsInRow = 0;
            int emptyCellsInCol = 0;
            int emptyCellsInBox = 0;

            // Count empty cells in the same row
            for (int c = 0; c < Size; c++)
            {
                if (c != col && allCells.Any(cell => cell.row == row && cell.col == c))
                {
                    emptyCellsInRow++;
                }
            }

            // Count empty cells in the same column
            for (int r = 0; r < Size; r++)
            {
                if (r != row && allCells.Any(cell => cell.row == r && cell.col == col))
                {
                    emptyCellsInCol++;
                }
            }

            // Count empty cells in the same 3x3 box
            int boxRow = row - row % SubgridSize;
            int boxCol = col - col % SubgridSize;
            for (int r = boxRow; r < boxRow + 3; r++)
            {
                for (int c = boxCol; c < boxCol + 3; c++)
                {
                    if ((r != row || c != col) && allCells.Any(cell => cell.row == r && cell.col == c))
                    {
                        emptyCellsInBox++;
                    }
                }
            }

            // More empty cells in the same constraints means higher score
            return (emptyCellsInRow + emptyCellsInCol + emptyCellsInBox) * 3;
        }

        private bool SolveWithHeuristics(int[,] board, List<(int row, int col, List<int> possibleValues)> cells)
        {
            if (cells.Count == 0)
            {
                return true;
            }

            var currentCell = cells[0];
            cells.RemoveAt(0);

            // Try values in order of their frequency in the row/column/box
            var orderedValues = OrderValuesByFrequency(board, currentCell);
            
            foreach (int num in orderedValues)
            {
                if (IsValid(board, currentCell.row, currentCell.col, num))
                {
                    board[currentCell.row, currentCell.col] = num;

                    if (SolveWithHeuristics(board, cells))
                    {
                        return true;
                    }

                    board[currentCell.row, currentCell.col] = 0;
                }
            }

            cells.Insert(0, currentCell);
            return false;
        }

        private List<int> OrderValuesByFrequency(int[,] board, (int row, int col, List<int> possibleValues) cell)
        {
            var frequency = new Dictionary<int, int>();
            foreach (int num in cell.possibleValues)
            {
                frequency[num] = 0;
            }

            // Count frequency in row
            for (int c = 0; c < Size; c++)
            {
                if (board[cell.row, c] != 0)
                {
                    frequency[board[cell.row, c]]++;
                }
            }

            // Count frequency in column
            for (int r = 0; r < Size; r++)
            {
                if (board[r, cell.col] != 0)
                {
                    frequency[board[r, cell.col]]++;
                }
            }

            // Count frequency in box
            int boxRow = cell.row - cell.row % SubgridSize;
            int boxCol = cell.col - cell.col % SubgridSize;
            for (int r = boxRow; r < boxRow + 3; r++)
            {
                for (int c = boxCol; c < boxCol + 3; c++)
                {
                    if (board[r, c] != 0)
                    {
                        frequency[board[r, c]]++;
                    }
                }
            }

            // Order by frequency (ascending) to try least used values first
            return cell.possibleValues.OrderBy(num => frequency[num]).ToList();
        }
    }
} 