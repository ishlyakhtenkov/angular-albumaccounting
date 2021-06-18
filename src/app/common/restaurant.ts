export class Restaurant {
    id: string;
    name: string;
    address: string;
    imageUrl: string;

    constructor(id: string, name: string, address: string, imageUrl: string) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.imageUrl = imageUrl;
    }
}
