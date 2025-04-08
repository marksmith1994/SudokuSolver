using SudokuSolver.Algorithm;

namespace SudoukuSolver.Tests;

public class ConstraintPropagationSolverTests : SudokuSolverTestBase
{
    private readonly ISudokuSolver _solver = new ConstraintPropagationSolver();

    #region Test Boards and Helpers
    private int[,] GetEasyBoard()
    {
        // ... (Same as in BacktrackingSolverTests) ...
        return new int[,]
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
    }

    private int[,] GetEasyBoardSolution()
    {
        // ... (Same as in BacktrackingSolverTests) ...
         return new int[,]
        {
            {5, 3, 4, 6, 7, 8, 9, 1, 2},
            {6, 7, 2, 1, 9, 5, 3, 4, 8},
            {1, 9, 8, 3, 4, 2, 5, 6, 7},
            {8, 5, 9, 7, 6, 1, 4, 2, 3},
            {4, 2, 6, 8, 5, 3, 7, 9, 1},
            {7, 1, 3, 9, 2, 4, 8, 5, 6},
            {9, 6, 1, 5, 3, 7, 2, 8, 4},
            {2, 8, 7, 4, 1, 9, 6, 3, 5},
            {3, 4, 5, 2, 8, 6, 1, 7, 9}
        };
    }

    private int[,] GetUnsolvableBoard()
    {
        // Board with conflicting numbers
        return new int[,]
        {
            {1, 2, 3, 4, 5, 6, 7, 8, 9},
            {1, 2, 3, 4, 5, 6, 7, 8, 9}, // Duplicate row
            {0, 0, 0, 0, 0, 0, 0, 0, 0},
            {0, 0, 0, 0, 0, 0, 0, 0, 0},
            {0, 0, 0, 0, 0, 0, 0, 0, 0},
            {0, 0, 0, 0, 0, 0, 0, 0, 0},
            {0, 0, 0, 0, 0, 0, 0, 0, 0},
            {0, 0, 0, 0, 0, 0, 0, 0, 0},
            {0, 0, 0, 0, 0, 0, 0, 0, 0}
        };
    }

    private void AssertBoardsEqual(int[,] expected, int[,] actual)
    {
        // ... (Same as in BacktrackingSolverTests) ...
        Assert.Equal(expected.GetLength(0), actual.GetLength(0));
        Assert.Equal(expected.GetLength(1), actual.GetLength(1));

        for (int i = 0; i < expected.GetLength(0); i++)
        {
            for (int j = 0; j < expected.GetLength(1); j++)
            {
                Assert.Equal(expected[i, j], actual[i, j]);
            }
        }
    }
    #endregion

    [Fact]
    public void Solve_EasyBoard_ShouldReturnSolvedTrueAndCorrectSolution()
    {
        // Arrange
        var board = GetEasyBoard();
        var expectedSolution = GetEasyBoardSolution();

        // Act
        var (solved, _) = _solver.Solve(board);

        // Assert
        Assert.True(solved);
        AssertBoardsEqual(expectedSolution, board);
    }

    [Fact]
    public void Solve_UnsolvableBoard_ShouldReturnSolvedFalse()
    {
        // Arrange
        var board = GetUnsolvableBoard();

        // Act
        var (solved, _) = _solver.Solve(board);

        // Assert
        Assert.False(solved);
    }
} 