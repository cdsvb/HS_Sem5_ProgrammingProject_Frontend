import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { first, map, Observable, startWith } from 'rxjs';
import { IListItem } from 'src/app/interfaces/list-item.interface';
import { IMovie } from 'src/app/interfaces/movie.interface';
import { IResult } from 'src/app/interfaces/result.interface';
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

  onRecommendationClicked() {
    this.backendService.getRecommendations(this.selectedItems.map(x => x.id)).pipe(first()).subscribe(res => {
      	console.log(res);
    });
  }

  private _filter(value: string): IMovie[] {
    let items = this.items.filter(option => option.title.toLowerCase().includes(value.toLowerCase()));
    items = items.length > 5 ? items.slice(0,5) : items;
    items.forEach(x => {
      let item = this.items.find(y => y.id == x.id) as IMovie;
      if(item.poster_path == undefined) {
        this.moviedbService.getMovie(x.title).pipe(first()).subscribe(res => {
          let path: string;
          let description: string = '';
          if(res.total_results > 0) {
            path = `https://image.tmdb.org/t/p/w500${res.results[0].poster_path}`;
            description = res.results[0].overview == undefined || res.results[0].overview == '' ? '*No description*' : res.results[0].overview;
          } else {
            path = "assets/img/empty.png";
            description = '*No description*';
          }
          x.poster_path = path;
          x.description = description;
          item.poster_path = path;
          item.description = description;
        });
      }
    });
    return items;
  }

  getTitle(id: string): string {
    if(this.items != undefined) {
      let item = this.items.find(movie => movie.id === id);
      return item == undefined ? '' : item.title;
    }
    return '';
  }

  removeTitle(id: string) {
    const element = this.selectedItems.find(y => y.id == id) as IMovie;
    this.items.push(element);
    var index = this.selectedItems.findIndex(x => x.id == id);
    this.selectedItems.splice(index, 1);
    this.movieForm.controls["id"].setValue(0);
  }

  searchImage(): void {
    this.getMoviePoster();
  }

  getMoviePoster() {
    const id: string = this.movieForm.controls["id"].value;
    const element = this.items.find(y => y.id == id) as IMovie;
    this.selectedItems.push(element);
    var index = this.items.findIndex(x => x.id == id);
    this.items.splice(index, 1);
    this.movieForm.controls["id"].setValue(0);
  }

}
