import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UrlSerializer } from "@angular/router";
import { Observable } from "rxjs";
import { IImage } from "../interfaces/image.interface";
import { ISearchResult } from "../interfaces/search-result.interface";

@Injectable({ providedIn: "root" })
export class MovieDBService {
private baseApiUrl: string = "https://api.themoviedb.org/3/";
private apiKey: string = "?api_key=477a08b42e9d56ffd7c50d3c183e29f4";

    constructor(private http: HttpClient, private serializer: UrlSerializer) { }

    getCoverImage(id: number): Observable<IImage> {
        return this.http.get<IImage>(`${this.baseApiUrl}movie/${id}/images${this.apiKey}`);
    }

    getMovie(title: string): Observable<ISearchResult> {
        return this.http.get<ISearchResult>(`${this.baseApiUrl}search/multi${this.apiKey}&language=en-US&query=${this.serializer.parse(title)}&page=1`);
    }
}
