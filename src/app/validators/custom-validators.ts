import { FormControl, ValidationErrors } from "@angular/forms";

export class CustomValidators {

    static notOnlyWhitespace(control: FormControl) : ValidationErrors {
        // check if string contains only whitespace
        if (control.value != null && (control.value.trim().length === 0)) {
            return { 'notOnlyWhitespace': true };
        } else {
            return null;
        }
    }

    static minOne(control: FormControl) : ValidationErrors {
        // check if number >= 1
        if (control.value != null && (control.value <= 0)) {
            return { 'minOne': true };
        } else {
            return null;
        }
    }
}

