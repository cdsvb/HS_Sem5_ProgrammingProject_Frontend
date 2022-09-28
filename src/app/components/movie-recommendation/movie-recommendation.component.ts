import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { first } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
import { MovieDBService } from 'src/app/services/moviedb.service';

@Component({
  selector: 'app-movie-recommendation',
  templateUrl: './movie-recommendation.component.html',
  styleUrls: ['./movie-recommendation.component.scss']
})
export class MovieRecommendationComponent implements OnInit {
public imagePath: string | undefined;
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
            this.imagePath = res.results[0].poster_path;
      }
    });
  }

}
