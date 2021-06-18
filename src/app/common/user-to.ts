export class UserTo {
    id: string;
    name: string;
    email: string;
    password: string;
    //remove password, add roles: string[]

    constructor(id: string, name: string, email: string, password: string) { 
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
    }
}
