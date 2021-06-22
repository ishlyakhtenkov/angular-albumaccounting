export class EmployeeTo {
    id: string;
    name: string;
    phoneNumber: string;
    departmentId: string;

    constructor(id: string, name: string, phoneNumber: string, departmentId: string) { 
        this.id = id;
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.departmentId = departmentId;
    }
}