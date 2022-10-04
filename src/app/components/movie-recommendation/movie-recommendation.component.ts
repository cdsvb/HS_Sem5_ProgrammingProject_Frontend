import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { first, map, Observable, startWith } from 'rxjs';
import { IListItem } from 'src/app/interfaces/list-item.interface';
import { IMovie } from 'src/app/interfaces/movie.interface';
import { IResult } from 'src/app/interfaces/result.interface';
import { ISearchResult } from 'src/app/interfaces/search-result.interface';
import { BackendService } from 'src/app/services/backend.service';
import { MovieDBService } from 'src/app/services/moviedb.service';

export const fadeAnimation = trigger('fadeAnimation', [
  transition(':enter', [
    style({ opacity: 0 }), animate('300ms', style({ opacity: 1 }))]
  ),
  transition(':leave',
    [style({ opacity: 1 }), animate('300ms', style({ opacity: 0 }))]
  )
]);

const listAnimation = trigger('listAnimation', [
  transition('* <=> *', [
    query(':enter',
      [style({ opacity: 0 }), stagger('200ms', animate('600ms ease-out', style({ opacity: 1 })))],
      { optional: true }
    )
  ])
]);

@Component({
  selector: 'app-movie-recommendation',
  templateUrl: './movie-recommendation.component.html',
  styleUrls: ['./movie-recommendation.component.scss'],
  animations: [fadeAnimation, listAnimation]
})
export class MovieRecommendationComponent implements OnInit {
public filteredOptions: Observable<IMovie[]>;


public items: IMovie[];
public recommendations: IMovie[] = [];


public selectedItems: IMovie[] = [];
public movieForm: FormGroup= new FormGroup({ 
  "id": new FormControl()
});

  constructor(private backendService: BackendService, private moviedbService: MovieDBService) { }

  ngOnInit(): void {
    this.backendService.getMovies().pipe(first()).subscribe(res => {
      this.items = res;
      this.filteredOptions = this.movieForm.controls['id'].valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || '')),
      );
    });
  }

  addMovie(id: string) {
    if(this.selectedItems.length < 5) {
      const element = this.items.find(y => y.id == id) as IMovie;
      this.selectedItems.push(element);
      var index = this.items.findIndex(x => x.id == id);
      this.items.splice(index, 1);
      this.movieForm.controls["id"].setValue(0);
    }
    if(this.selectedItems.length == 5) {
      this.movieForm.disable();
    }
  }

  onRecommendationClicked() {
    this.recommendations = [];
    this.backendService.getRecommendations(this.selectedItems.map(x => x.id)).pipe(first()).subscribe(async res => {
      for(let x = 0; x < res.length; x++) {
        for(let y = 0; y < res[x].recommendations.length; y++) {
          let id = res[x].recommendations[y];
          let movie = this.items.find(z => z.id == id) as IMovie;
          if(this.recommendations !== undefined && this.recommendations.length > 0) {
            if(this.recommendations.findIndex(r => r.id == id) >= 0) {
              continue;
            }
          }
          this.recommendations.push(movie);
          this.getProperties(movie, x == res.length -1 && y == res[x].recommendations.length - 1);
        }
      }
    });
  }

  private _filter(value: string): IMovie[] {
    let items = this.items.filter(option => option.title.toLowerCase().includes(value.toLowerCase()));
    items = items.length > 5 ? items.slice(0,5) : items;
    items.forEach(x => {
      this.getProperties(x, false);
    });
    return items;
  }
  async getProperties(x: IMovie, recommend: boolean) {
      let item = this.items.find(y => y.id == x.id) as IMovie;
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
    if(recommend){
      this.recommendations.sort(function(a, b) {
        return (a.vote_average > b.vote_average) ? -1 : 1;
      });
      console.log(this.recommendations.slice(0,5));
    }
}

  getTitle(id: string): string {
    if(this.items != undefined) {
      let item = this.items.find(movie => movie.id === id);
      return item == undefined ? '' : item.title;
    }
    return '';
  }

  isDisabled(): boolean {
    return this.selectedItems.length > 4;
  }

  recommendDisabled(): boolean {
    return this.selectedItems.length < 1;
  }

  removeTitle(id: string) {
    const element = this.selectedItems.find(y => y.id == id) as IMovie;
    this.items.push(element);
    var index = this.selectedItems.findIndex(x => x.id == id);
    this.selectedItems.splice(index, 1);
    this.movieForm.controls["id"].setValue(0);
    if(this.selectedItems.length < 5) {
      this.movieForm.enable();
    }
  }

}
