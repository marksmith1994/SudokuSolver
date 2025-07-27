import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { SudokuBoardComponent } from './components/sudoku-board/sudoku-board.component';
import { AlgorithmSelectorComponent } from './components/algorithm-selector/algorithm-selector.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { ResultsDisplayComponent } from './components/results-display/results-display.component';
import { ResultsVisualizationComponent } from './components/results-visualization/results-visualization.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SudokuBoardComponent,
    AlgorithmSelectorComponent,
    FileUploadComponent,
    ResultsDisplayComponent,
    ResultsVisualizationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { } 