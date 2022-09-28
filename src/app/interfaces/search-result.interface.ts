import { IResult } from "./result.interface";

export interface ISearchResult {
    page: number;
    results: IResult[];
    total_pages: number;
    total_results: number;
}