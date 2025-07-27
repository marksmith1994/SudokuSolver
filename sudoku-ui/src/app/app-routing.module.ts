import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResultsVisualizationComponent } from './components/results-visualization/results-visualization.component';

const routes: Routes = [
  { path: 'visualization', component: ResultsVisualizationComponent },
  { path: '', redirectTo: '/', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { } 