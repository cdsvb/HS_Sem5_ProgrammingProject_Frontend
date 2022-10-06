import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UrlSerializer } from "@angular/router";
import { Observable } from "rxjs";
import { IMovie } from "../interfaces/movie.interface";
import { IRecommendation } from "../interfaces/recommendation.interface";
import { ISearchResult } from "../interfaces/search-result.interface";

@Injectable({ providedIn: "root" })
export class DataService {
    public items: IMovie[];


    constructor(private http: HttpClient, private serializer: UrlSerializer) { }

    getItems(): IMovie[] {
        return this.items;
    }

    setItems(movies: IMovie[]) {
        this.items = movies;
    }

    findItem(id: string): IMovie {
        return this.items.find(x => x.id == id) as IMovie;
    }

    addItem(movie: IMovie) {
        this.items.push(movie);
    }

    removeItem(id: string) {
        var index = this.items.findIndex(x => x.id == id);
        this.items.splice(index, 1);
    }
}
