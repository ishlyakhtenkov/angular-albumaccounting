export class AlbumTo {
    id: string;
    decimalNumber: string;
    stamp: string;
    holderId: string;

    constructor(id: string, decimalNumber: string, stamp: string, holderId: string) { 
        this.id = id;
        this.decimalNumber = decimalNumber;
        this.stamp = stamp;
        this.holderId = holderId;
    }
}