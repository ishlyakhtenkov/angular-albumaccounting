import { Restaurant } from "./restaurant";
import { User } from "./user";

export class Vote {
    id: string;
    user: User;
    restaurant: Restaurant;
}
