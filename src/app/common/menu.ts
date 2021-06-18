import { Dish } from "./dish";

export class Menu {
    id: string;
    date: Date;
    dishes: Dish[] = [];
}
