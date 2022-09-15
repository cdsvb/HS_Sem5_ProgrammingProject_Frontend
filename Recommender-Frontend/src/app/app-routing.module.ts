import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MovieRecommendationComponent } from './components/movie-recommendation/movie-recommendation.component';

const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: 'recommendation', component: MovieRecommendationComponent},
  { path: '**', redirectTo: '/'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


