import { Department } from "./department";

export class Employee {
    id: string;
    name: string;
    phoneNumber: string;
    department: Department;

    constructor(id: string, name: string, phoneNumber: string) { 
        this.id = id;
        this.name = name;
        this.phoneNumber = phoneNumber;
    }
}