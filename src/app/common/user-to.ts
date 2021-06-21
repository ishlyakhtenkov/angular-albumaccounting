export class UserTo {
    id: string;
    name: string;
    email: string;
    enabled: boolean;
    roles: string[];

    constructor(id: string, name: string, email: string, enabled: boolean, roles: string[]) { 
        this.id = id;
        this.name = name;
        this.email = email;
        this.enabled = enabled;
        this.roles = roles;
    }
}
