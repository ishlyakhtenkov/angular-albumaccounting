import { Dish } from "./dish";

export class MenuTo {
    dishes: Dish[] = [];

    constructor(dishes: Dish[]) {
        this.dishes = dishes;
    }
}
