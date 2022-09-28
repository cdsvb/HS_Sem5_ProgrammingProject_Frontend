import { IBackdrop } from "./backdrop.interface";
import { IPoster } from "./poster.interface";

export interface IImage {
    id: number;
    backdrops: IBackdrop[];
    posters: IPoster[];
}