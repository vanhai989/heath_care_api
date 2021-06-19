import {HttpError} from "routing-controllers/http-error/HttpError";

export class WrongPasswordErrors extends HttpError {

    constructor(code: number) {
        super(code, "Wrong Password!");
    }
}

