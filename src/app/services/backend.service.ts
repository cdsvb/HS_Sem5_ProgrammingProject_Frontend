import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UrlSerializer } from "@angular/router";
import { Observable } from "rxjs";
import { IMovie } from "../interfaces/movie.interface";
import { ISearchResult } from "../interfaces/search-result.interface";

@Injectable({ providedIn: "root" })
export class BackendService {
private baseApiUrl: string = "https://recommender-system-hs.herokuapp.com/";

    constructor(private http: HttpClient, private serializer: UrlSerializer) { }

    // getCoverImage(id: number): Observable<ICategory[]> {
    //     return this.http.get<ICategory[]>(`${this.baseApiUrl}categories${this.apiKey}`);
    // }

    getMovies(): Observable<IMovie[]> {
        return this.http.get<IMovie[]>(`${this.baseApiUrl}movies`);
    }
}
