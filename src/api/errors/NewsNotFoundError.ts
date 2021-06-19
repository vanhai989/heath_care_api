import {HttpError} from "routing-controllers/http-error/HttpError";

export class NewsErrors extends HttpError {

    constructor(code: number) {
        super(code, "News Not Found!");
    }
}
