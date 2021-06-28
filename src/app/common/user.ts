export class User {
    id: string;
    name: string;
    email: string;
    password: string;
    enabled: boolean;
    registered: Date;
    roles: string[];

    constructor(id: string, name: string, email: string, password: string, enabled: boolean, roles: string[]) { 
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.enabled = enabled;
        this.roles = roles;
    }
}