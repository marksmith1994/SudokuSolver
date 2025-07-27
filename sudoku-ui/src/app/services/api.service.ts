import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SolveResult } from '../components/results-display/results-display.component';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // Update this URL to point to your C# backend API
  // For Docker development, use port 5001 (mapped from container port 5000)
  // For Azure deployment, use the Azure API URL
  private apiUrl = 'https://sudoku-solver-h8asbyatccg8e3dg.uksouth-01.azurewebsites.net/api';

  constructor(private http: HttpClient) { }

  // Call your C# backend API
  solvePuzzle(board: number[][], algorithm: string): Observable<SolveResult> {
    return this.http.post<SolveResult>(`${this.apiUrl}/sudoku/solve`, {
      board: board,
      algorithm: algorithm
    });
  }

  // Compare all algorithms
  compareAlgorithms(board: number[][]): Observable<SolveResult[]> {
    return this.http.post<SolveResult[]>(`${this.apiUrl}/sudoku/compare`, {
      board: board
    });
  }

  // Get available algorithms
  getAlgorithms(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/sudoku/algorithms`);
  }
} 