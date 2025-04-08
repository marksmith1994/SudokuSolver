using System;
using System.Diagnostics;
using System.Collections.Generic;

namespace SudokuSolver.Algorithm
{
    public class DancingLinksSolver : ISudokuSolver
    {
        private class Node
        {
            public Node Left, Right, Up, Down;
            public ColumnNode Column;
            public int Row;

            public Node()
            {
                Left = Right = Up = Down = this;
            }
        }

        private class ColumnNode : Node
        {
            public int Size;
            public string Name;

            public ColumnNode(string name)
            {
                Size = 0;
                Name = name;
                Column = this;
            }
        }

        private ColumnNode header;
        private List<Node> solution;

        public (bool solved, TimeSpan timeTaken) Solve(int[,] board)
        {
            var stopwatch = Stopwatch.StartNew();
            solution = new List<Node>();
            bool result = SolveSudoku(board);
            stopwatch.Stop();
            return (result, stopwatch.Elapsed);
        }

        private bool SolveSudoku(int[,] board)
        {
            header = CreateDLXMatrix(board);
            if (header == null) return false;

            return Search(0);
        }

        private ColumnNode CreateDLXMatrix(int[,] board)
        {
            // Create header node
            header = new ColumnNode("header");

            // Create column nodes for each constraint
            ColumnNode[] columnNodes = new ColumnNode[324]; // 9x9x4 constraints
            for (int i = 0; i < 324; i++)
            {
                columnNodes[i] = new ColumnNode($"col{i}");
                columnNodes[i].Right = header;
                columnNodes[i].Left = header.Left;
                header.Left.Right = columnNodes[i];
                header.Left = columnNodes[i];
            }

            // Create nodes for each possible number in each cell
            for (int row = 0; row < 9; row++)
            {
                for (int col = 0; col < 9; col++)
                {
                    int startValue = board[row, col];
                    int[] values = startValue == 0 ? Enumerable.Range(1, 9).ToArray() : new[] { startValue };

                    foreach (int num in values)
                    {
                        Node[] nodes = new Node[4];
                        for (int i = 0; i < 4; i++)
                        {
                            nodes[i] = new Node();
                        }

                        // Cell constraint
                        int cellConstraint = row * 9 + col;
                        LinkNode(nodes[0], columnNodes[cellConstraint]);

                        // Row constraint
                        int rowConstraint = 81 + row * 9 + (num - 1);
                        LinkNode(nodes[1], columnNodes[rowConstraint]);

                        // Column constraint
                        int colConstraint = 162 + col * 9 + (num - 1);
                        LinkNode(nodes[2], columnNodes[colConstraint]);

                        // Box constraint
                        int boxRow = row / 3;
                        int boxCol = col / 3;
                        int boxConstraint = 243 + (boxRow * 3 + boxCol) * 9 + (num - 1);
                        LinkNode(nodes[3], columnNodes[boxConstraint]);

                        // Link nodes horizontally
                        for (int i = 0; i < 4; i++)
                        {
                            nodes[i].Right = nodes[(i + 1) % 4];
                            nodes[i].Left = nodes[(i + 3) % 4];
                        }
                    }
                }
            }

            return header;
        }

        private void LinkNode(Node node, ColumnNode column)
        {
            node.Column = column;
            node.Down = column;
            node.Up = column.Up;
            column.Up.Down = node;
            column.Up = node;
            column.Size++;
        }

        private bool Search(int k)
        {
            if (header.Right == header)
            {
                return true;
            }

            ColumnNode c = SelectColumn();
            Cover(c);

            for (Node r = c.Down; r != c; r = r.Down)
            {
                solution.Add(r);

                for (Node j = r.Right; j != r; j = j.Right)
                {
                    Cover(j.Column);
                }

                if (Search(k + 1))
                {
                    return true;
                }

                solution.RemoveAt(solution.Count - 1);

                for (Node j = r.Left; j != r; j = j.Left)
                {
                    Uncover(j.Column);
                }
            }

            Uncover(c);
            return false;
        }

        private ColumnNode SelectColumn()
        {
            ColumnNode c = null;
            int minSize = int.MaxValue;

            for (ColumnNode j = (ColumnNode)header.Right; j != header; j = (ColumnNode)j.Right)
            {
                if (j.Size < minSize)
                {
                    minSize = j.Size;
                    c = j;
                }
            }

            return c;
        }

        private void Cover(ColumnNode c)
        {
            c.Right.Left = c.Left;
            c.Left.Right = c.Right;

            for (Node i = c.Down; i != c; i = i.Down)
            {
                for (Node j = i.Right; j != i; j = j.Right)
                {
                    j.Down.Up = j.Up;
                    j.Up.Down = j.Down;
                    j.Column.Size--;
                }
            }
        }

        private void Uncover(ColumnNode c)
        {
            for (Node i = c.Up; i != c; i = i.Up)
            {
                for (Node j = i.Left; j != i; j = j.Left)
                {
                    j.Column.Size++;
                    j.Down.Up = j;
                    j.Up.Down = j;
                }
            }

            c.Right.Left = c;
            c.Left.Right = c;
        }
    }
} 