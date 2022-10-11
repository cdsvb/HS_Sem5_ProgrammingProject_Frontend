import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { first, map, Observable, startWith } from 'rxjs';
import { IListItem } from 'src/app/interfaces/list-item.interface';
import { IMovie } from 'src/app/interfaces/movie.interface';
import { IResult } from 'src/app/interfaces/result.interface';
import { ISearchResult } from 'src/app/interfaces/search-result.interface';
import { BackendService } from 'src/app/services/backend.service';
import { DataService } from 'src/app/services/data.service';
import { MovieDBService } from 'src/app/services/moviedb.service';
import { RecommendationResultComponent } from '../recommendation-result/recommendation-result.component';

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

public selectedItems: IMovie[] = [];
public movieForm: FormGroup= new FormGroup({ 
  "id": new FormControl()
});

  constructor(private dialog: MatDialog,
     private backendService: BackendService,
     private moviedbService: MovieDBService,
     private dataService: DataService) { }

  ngOnInit(): void {
    this.backendService.getMovies().pipe(first()).subscribe(res => {
      this.dataService.setItems(res);
      this.filteredOptions = this.movieForm.controls['id'].valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || '')),
      );
    });
  }

  addMovie(id: string) {
    if(this.selectedItems.length < 5) {

      const element = this.dataService.findItem(id);
      this.selectedItems.push(element);
      this.dataService.removeItem(id);
      this.movieForm.controls["id"].setValue(0);
    }
    if(this.selectedItems.length == 5) {
      this.movieForm.disable();
    }
  }

  onRecommendationClicked() {
    let dialogRef = this.dialog.open(RecommendationResultComponent, {
      height: '575px',
      width: '1450px',
      data: { data: this.dataService, items: this.selectedItems }
    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }

  private _filter(value: string): IMovie[] {
    let items = this.dataService.getItems().filter(option => option.title.toLowerCase().includes(value.toLowerCase()));
    items = items.length > 5 ? items.slice(0,5) : items;
    items.forEach(x => {
      this.getProperties(x);
    });
    return items;
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
          path = "assets/img/ticket.jpg";
          description = '*No description*';
        }
        x.poster_path = path;
        x.description = description;
        x.vote_average = vote_average;
        item.poster_path = path;
        item.description = description;
        item.vote_average = vote_average;
    }
}

clearSelection(): void {
  this.selectedItems.forEach(x => {
    this.dataService.addItem(x);
  });
  this.selectedItems = [];
}

  getTitle(id: string): string {
    let item = this.dataService.findItem(id);
    return item == undefined ? '' : item.title;
  }

  isDisabled(): boolean {
    return this.selectedItems.length > 4;
  }

  recommendDisabled(): boolean {
    return this.selectedItems.length < 1;
  }

  removeTitle(id: string) {
    const element = this.selectedItems.find(y => y.id == id) as IMovie;
    this.dataService.addItem(element);
    var index = this.selectedItems.findIndex(x => x.id == id);
    this.selectedItems.splice(index, 1);
    this.movieForm.controls["id"].setValue(0);
    if(this.selectedItems.length < 5) {
      this.movieForm.enable();
    }
  }

}
