using Microsoft.AspNetCore.Mvc;
using SudokuSolver.Algorithm;
using System.Diagnostics;

namespace SudokuSolver.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SudokuController : ControllerBase
{
    private readonly Dictionary<string, ISudokuSolver> _solvers;

    public SudokuController()
    {
        _solvers = new Dictionary<string, ISudokuSolver>
        {
            { "backtracking", new BacktrackingSolver() },
            { "constraint-propagation", new ConstraintPropagationSolver() },
            { "dancing-links", new DancingLinksSolver() },
            { "possibility-sort", new PossibilitySortSolver() },
            { "heuristic-backtracking", new HeuristicBacktrackingSolver() },
            { "brute-force", new BruteForceSolver() }
        };
    }

    [HttpPost("solve")]
    public IActionResult Solve([FromBody] SolveRequest request)
    {
        if (!_solvers.ContainsKey(request.Algorithm))
        {
            return BadRequest($"Unknown algorithm: {request.Algorithm}");
        }

        // Convert jagged array to 2D array
        var board2D = ConvertTo2DArray(request.Board);
        
        var solver = _solvers[request.Algorithm];
        var (solved, timeTaken) = solver.Solve(board2D);

        var result = new SolveResponse
        {
            algorithm = request.Algorithm,
            solved = solved,
            timeMs = timeTaken.TotalMilliseconds,
            solution = solved ? ConvertToJaggedArray(board2D) : null
        };

        return Ok(result);
    }

    [HttpPost("compare")]
    public IActionResult Compare([FromBody] CompareRequest request)
    {
        var results = new List<SolveResponse>();

        // Convert jagged array to 2D array
        var board2D = ConvertTo2DArray(request.Board);

        foreach (var solver in _solvers)
        {
            var (solved, timeTaken) = solver.Value.Solve((int[,])board2D.Clone());
            
            results.Add(new SolveResponse
            {
                algorithm = solver.Key,
                solved = solved,
                timeMs = timeTaken.TotalMilliseconds,
                solution = solved ? ConvertToJaggedArray(board2D) : null
            });
        }

        return Ok(results);
    }

    [HttpGet("algorithms")]
    public IActionResult GetAlgorithms()
    {
        return Ok(_solvers.Keys);
    }

    [HttpGet("health")]
    public IActionResult Health()
    {
        return Ok(new { status = "healthy", timestamp = DateTime.UtcNow });
    }

    private int[,] ConvertTo2DArray(int[][] jaggedArray)
    {
        var result = new int[9, 9];
        for (int i = 0; i < 9; i++)
        {
            for (int j = 0; j < 9; j++)
            {
                result[i, j] = jaggedArray[i][j];
            }
        }
        return result;
    }

    private int[][] ConvertToJaggedArray(int[,] array2D)
    {
        var result = new int[9][];
        for (int i = 0; i < 9; i++)
        {
            result[i] = new int[9];
            for (int j = 0; j < 9; j++)
            {
                result[i][j] = array2D[i, j];
            }
        }
        return result;
    }
}

public class SolveRequest
{
    public int[][] Board { get; set; } = new int[9][];
    public string Algorithm { get; set; } = string.Empty;
}

public class CompareRequest
{
    public int[][] Board { get; set; } = new int[9][];
}

public class SolveResponse
{
    public string algorithm { get; set; } = string.Empty;
    public bool solved { get; set; }
    public double timeMs { get; set; }
    public int[][]? solution { get; set; }
} 