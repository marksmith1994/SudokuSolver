using System;

namespace SudokuSolver.Algorithm
{
    public abstract class BaseSolver : ISudokuSolver
    {
        protected const int Size = 9;
        protected const int SubgridSize = 3;

        public abstract (bool solved, TimeSpan timeTaken) Solve(int[,] board);

        protected bool IsBoardInitiallyValid(int[,] board)
        {
            for (int row = 0; row < Size; row++)
            {
                for (int col = 0; col < Size; col++)
                {
                    int originalValue = board[row, col];
                    if (originalValue != 0)
                    {
                        // Temporarily set to 0 to allow IsValid to check against constraints
                        board[row, col] = 0;
                        bool valid = IsValid(board, row, col, originalValue);
                        board[row, col] = originalValue; // Restore original value

                        if (!valid)
                        {
                            return false; // Found an initial conflict
                        }
                    }
                }
            }
            return true; // No initial conflicts found
        }

        protected bool IsValid(int[,] board, int row, int col, int num)
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