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
public selectedRecommendations: IMovie[] = [];
public dataService: DataService;
public items: IMovie[] = [];
public tasks: number = 0;
public recommendationCount: number = 5;
public finished: number = 0;

  constructor(private backendService: BackendService,
    private moviedbService: MovieDBService,
     private dialogRef: MatDialogRef<RecommendationResultComponent>,
     @Inject(MAT_DIALOG_DATA) data: DialogData) 
    { 
      this.dataService = data.data;
      this.items = data.items;
    }

  ngOnInit(): void {
    this.loadRecommendations();
  }

  moreDisabled(): boolean {
    return this.recommendations.length <= this.recommendationCount;
  }

  onLoadMoreClicked() {
    if(this.recommendationCount == 5) this.dialogRef.updateSize('1450px', '970px');
    this.recommendationCount = this.recommendationCount + 5;
    this.selectedRecommendations = this.recommendations.slice(0, this.recommendationCount);
  }

  loadRecommendations() {
    if(this.items !== undefined) {
      this.recommendations = [];
      this.backendService.getRecommendations(this.items?.map(x => x.id)).pipe(first()).subscribe(async res => {
        this.finished = 0;
        this.tasks = res.length;
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
  }

  setReady() {
    if(this.finished == this.tasks) {
      this.recommendations.sort(function(a, b) {
        return (a.vote_average > b.vote_average) ? -1 : 1;
      });
      this.selectedRecommendations = this.recommendations.slice(0, 5);
    } else {
      this.finished++;
    }
  }

  getBackgroundColor(average: number): string {
    if(average >= 80) return 'rgba(50,205,50,0.8)';
    else if(average < 80 && average >= 60) return 'rgba(154,205,50,0.8)';
    else if(average < 60 && average >= 40) return 'rgba(255,255,0,0.8)';
    else if(average < 40 && average >= 20) return 'rgba(255,165,0,0.8)';
    else return 'rgba(220, 20, 60,0.8)';
  }

  async getProperties(x: IMovie) {
    let item = this.dataService.findItem(x.id);
    if(item.poster_path == undefined) {
      this.moviedbService.getMovie(x.title).pipe(first()).subscribe(result => {
      let path: string;
      let description: string = '';
      let vote_average: number = 0;
      if(result.results.length > 0) {
        let item = result.results[0];
        path = item.poster_path !== null ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "assets/img/ticket.jpg";
        description = item.overview == undefined || item.overview == '' ? '*No description*' : item.overview;
        vote_average = item.vote_average;
      } else {
        path = "assets/img/ticket.jpg";
        description = '*No description*';
      }
      x.poster_path = path;
      x.description = description;
      x.vote_average = vote_average;
      item.poster_path = path;
      item.description = description;
      item.vote_average = vote_average;
      this.setReady();
    });
  } else {
    this.setReady();
  } 
  }
}

