export class AlbumTo {
    id: string;
    decimalNumber: string;
    stamp: string;
    receivingDate: Date;
    holderId: string;

    constructor(id: string, decimalNumber: string, stamp: string, receivingDate: Date, holderId: string) { 
        this.id = id;
        this.decimalNumber = decimalNumber;
        this.stamp = stamp;
        this.receivingDate = receivingDate;
        this.holderId = holderId;
    }
}