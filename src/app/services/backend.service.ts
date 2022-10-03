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

    getRecommendations(ids: string[]): Observable<string[]> {
        let body = '';
        for(let i = 0; i < ids.length; i++) {
            body = body + ids[i].toString();
            if(i < ids.length - 1)
            	body = body + ',';
        }
        return this.http.post<string[]>(`${this.baseApiUrl}recommendation`, { movies: body });
    }

    getMovies(): Observable<IMovie[]> {
        return this.http.get<IMovie[]>(`${this.baseApiUrl}movies`);
    }
}
