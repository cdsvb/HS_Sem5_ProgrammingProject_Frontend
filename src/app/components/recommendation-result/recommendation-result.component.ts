import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IMovie } from 'src/app/interfaces/movie.interface';
import { BackendService } from 'src/app/services/backend.service';
import { DataService } from 'src/app/services/data.service';
import { first } from 'rxjs';
import { ISearchResult } from 'src/app/interfaces/search-result.interface';
import { MovieDBService } from 'src/app/services/moviedb.service';

export interface DialogData {
  data: DataService;
  items: IMovie[];
}

@Component({
  selector: 'app-recommendation-result',
  templateUrl: './recommendation-result.component.html',
  styleUrls: ['./recommendation-result.component.scss']
})
export class RecommendationResultComponent implements OnInit {
public recommendations: IMovie[] = [];
public dataService: DataService;

  constructor(private backendService: BackendService,
    private moviedbService: MovieDBService,
     private dialogRef: MatDialogRef<RecommendationResultComponent>,
     @Inject(MAT_DIALOG_DATA) data: DialogData) 
    { 
      this.dataService = data.data;
      this.loadRecommendations(data.items);
    }

  ngOnInit(): void {
  }

  loadRecommendations(selectedItems: IMovie[]) {
    this.recommendations = [];
    this.backendService.getRecommendations(selectedItems.map(x => x.id)).pipe(first()).subscribe(async res => {
      for(let x = 0; x < res.length; x++) {
        for(let y = 0; y < res[x].recommendations.length; y++) {
          let id = res[x].recommendations[y];
          let movie = this.dataService.findItem(id);
          if(this.recommendations !== undefined && this.recommendations.length > 0) {
            if(this.recommendations.findIndex(r => r.id == id) >= 0) {
              continue;
            }
          }
          this.recommendations.push(movie);
          this.getProperties(movie);
        }
      }
    });
  }

  async getProperties(x: IMovie) {
    let item = this.dataService.findItem(x.id);
    if(item.poster_path == undefined) {
      var result = (await this.moviedbService.getMovie(x.title).pipe(first()).toPromise()) as ISearchResult;
      let path: string;
      let description: string = '';
      let vote_average: number = 0;
      if(result.results.length > 0) {
        let item = result.results[0];
        path = `https://image.tmdb.org/t/p/w500${item.poster_path}`;
        description = item.overview == undefined || item.overview == '' ? '*No description*' : item.overview;
        vote_average = item.vote_average;
      } else {
        path = "assets/img/empty.png";
        description = '*No description*';
      }
      x.poster_path = path;
      x.description = description;
      x.vote_average = vote_average;
      item.poster_path = path;
      item.description = description;
      item.vote_average = vote_average;
  }
  this.recommendations.sort(function(a, b) {
    return (a.vote_average > b.vote_average) ? -1 : 1;
  });
  console.log(this.recommendations.slice(0,5));
}

}
