import { SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
export interface IMovie {
    id: string;
    title: string;
    vote_average: number;
    release_year: string;
    poster_path: string;
    description: string;
    image: Observable<SafeUrl>
}