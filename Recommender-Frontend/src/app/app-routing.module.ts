import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MovieRecommendationComponent } from './components/movie-recommendation/movie-recommendation.component';

const routes: Routes = [
  { path: '', component: DashboardComponent},
  { path: 'recommendation', component: MovieRecommendationComponent},
  { path: '**', redirectTo: '/'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


