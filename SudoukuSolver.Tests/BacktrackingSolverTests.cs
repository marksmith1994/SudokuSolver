using SudokuSolver.Algorithm;

namespace SudoukuSolver.Tests;

public class BacktrackingSolverTests : SudokuSolverTestBase
{
    private readonly ISudokuSolver _solver = new BacktrackingSolver();

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