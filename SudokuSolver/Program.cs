using System;
using System.Diagnostics;
using System.Linq;
using SudokuSolver.Algorithm;

namespace SudokuSolver
{
    class Program
    {
        // Default Sudoku puzzle (0 represents empty cells)
        private static readonly int[,] defaultBoard = new int[,]
        {
            {5, 3, 0, 0, 7, 0, 0, 0, 0},
            {6, 0, 0, 1, 9, 5, 0, 0, 0},
            {0, 9, 8, 0, 0, 0, 0, 6, 0},
            {8, 0, 0, 0, 6, 0, 0, 0, 3},
            {4, 0, 0, 8, 0, 3, 0, 0, 1},
            {7, 0, 0, 0, 2, 0, 0, 0, 6},
            {0, 6, 0, 0, 0, 0, 2, 8, 0},
            {0, 0, 0, 4, 1, 9, 0, 0, 5},
            {0, 0, 0, 0, 8, 0, 0, 7, 9}
        };

        static void Main(string[] args)
        {
            while (true)
            {
                Console.WriteLine("\nSudoku Solver Menu:");
                Console.WriteLine("1. Solve Sudoku");
                Console.WriteLine("2. Compare Algorithms");
                Console.WriteLine("3. Exit");
                Console.Write("Enter your choice: ");

                if (!int.TryParse(Console.ReadLine(), out int choice))
                {
                    Console.WriteLine("Invalid input. Please enter a number.");
                    continue;
                }

                switch (choice)
                {
                    case 1:
                        SolveSudoku();
                        break;
                    case 2:
                        CompareAlgorithms();
                        break;
                    case 3:
                        return;
                    default:
                        Console.WriteLine("Invalid choice. Please try again.");
                        break;
                }
            }
        }

        static void SolveSudoku()
        {
            Console.WriteLine("\nSelect algorithm:");
            Console.WriteLine("1. Backtracking");
            Console.WriteLine("2. Constraint Propagation");
            Console.WriteLine("3. Dancing Links");
            Console.WriteLine("4. Bubble Sort (by possibilities)");
            Console.WriteLine("5. Heuristic Search");
            Console.WriteLine("6. Brute Force");
            Console.Write("Enter your choice: ");

            if (!int.TryParse(Console.ReadLine(), out int choice) || choice < 1 || choice > 6)
            {
                Console.WriteLine("Invalid choice.");
                return;
            }

            ISudokuSolver solver = choice switch
            {
                1 => new BacktrackingSolver(),
                2 => new ConstraintPropagationSolver(),
                3 => new DancingLinksSolver(),
                4 => new BubbleSort(),
                5 => new HeuristicSearch(),
                6 => new BruteForceSolver(),
                _ => throw new InvalidOperationException("Invalid solver choice")
            };

            int[,] board = GetBoardFromUser();
            if (board == null) return;

            Console.WriteLine("\nInitial board (if not default):");
            if (board != defaultBoard) // Print only if it's not the default (already printed)
            {
                PrintBoard(board);
            }

            var (solved, timeTaken) = solver.Solve(board);

            Console.WriteLine($"\nTime taken: {timeTaken.TotalMilliseconds} ms");
            if (solved)
            {
                Console.WriteLine("\nSolved board:");
                PrintBoard(board);
            }
            else
            {
                Console.WriteLine("\nNo solution found.");
            }
        }

        static void CompareAlgorithms()
        {
            int[,] board = GetBoardFromUser();
            if (board == null) return;

            Console.WriteLine("\nInitial board (if not default):");
            if (board != defaultBoard) // Print only if it's not the default (already printed)
            {
                PrintBoard(board);
            }

            var solvers = new ISudokuSolver[]
            {
                new BacktrackingSolver(),
                new ConstraintPropagationSolver(),
                new DancingLinksSolver(),
                new BubbleSort(),
                new HeuristicSearch(),
                new BruteForceSolver()
            };

            var results = solvers.Select(solver =>
            {
                Console.WriteLine($"\nRunning {solver.GetType().Name}...");
                var (solved, timeTaken) = solver.Solve((int[,])board.Clone());
                return new { Solver = solver.GetType().Name, Solved = solved, Time = timeTaken };
            }).ToList();

            Console.WriteLine("\nComparison Results:");
            Console.WriteLine("------------------");
            foreach (var result in results.OrderBy(r => r.Time))
            {
                Console.WriteLine($"{result.Solver}: {(result.Solved ? "Solved" : "Failed")} in {result.Time.TotalMilliseconds} ms");
            }
        }

        static int[,] GetBoardFromUser()
        {
            Console.WriteLine("\nDo you want to use the default Sudoku board? (Y/N)");
            string useDefault = Console.ReadLine()?.Trim().ToUpper();

            if (useDefault == "Y")
            {
                Console.WriteLine("Using default board:");
                PrintBoard(defaultBoard);
                return (int[,])defaultBoard.Clone(); // Return a clone to avoid modifying the original
            }
            else
            {
                return ReadSudokuBoard();
            }
        }

        static int[,] ReadSudokuBoard()
        {
            Console.WriteLine("\nEnter Sudoku board (9x9, use 0 for empty cells):");
            int[,] board = new int[9, 9];

            for (int row = 0; row < 9; row++)
            {
                Console.Write($"Row {row + 1}: ");
                string input = Console.ReadLine();
                if (input.Length != 9)
                {
                    Console.WriteLine("Invalid input. Each row must have exactly 9 digits.");
                    return null;
                }

                for (int col = 0; col < 9; col++)
                {
                    if (!int.TryParse(input[col].ToString(), out int value) || value < 0 || value > 9)
                    {
                        Console.WriteLine("Invalid input. Use digits 0-9 only.");
                        return null;
                    }
                    board[row, col] = value;
                }
            }

            return board;
        }

        static void PrintBoard(int[,] board)
        {
            for (int row = 0; row < 9; row++)
            {
                if (row % 3 == 0 && row != 0)
                {
                    Console.WriteLine("------+-------+------");
                }
                for (int col = 0; col < 9; col++)
                {
                    if (col % 3 == 0 && col != 0)
                    {
                        Console.Write("| ");
                    }
                    Console.Write(board[row, col] == 0 ? ". " : $"{board[row, col]} ");
                }
                Console.WriteLine();
            }
        }
    }
}
