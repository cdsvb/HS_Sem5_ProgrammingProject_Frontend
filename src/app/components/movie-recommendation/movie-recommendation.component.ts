import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { first } from 'rxjs';
import { IListItem } from 'src/app/interfaces/list-item.interface';
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
    ),
    query(':leave',
      animate('600ms', style({ opacity: 0 })),
      { optional: true}
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
public items: IResult[] = [];
public movieForm: FormGroup= new FormGroup({ 
  "name": new FormControl()
});

  constructor(private backendService: BackendService, private moviedbService: MovieDBService) { }

  ngOnInit(): void {
  }

  searchImage(): void {
    this.getMoviePoster();
  }

  getMoviePoster() {
    const title = this.movieForm.controls["name"].value;
    console.log(title);
    this.moviedbService.getMovie(title).pipe(first()).subscribe(res => {
      console.log(res);
      if(res.total_results > 0) {
          const item = res.results[0];
          item.name = item.original_name ?? item.original_title;
          item.poster_path = `https://image.tmdb.org/t/p/w500${item.poster_path}`;
          this.items.push(item);
      }
    });
  }

}
