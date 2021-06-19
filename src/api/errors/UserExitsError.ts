import {HttpError} from "routing-controllers/http-error/HttpError";
import {StatusCodes} from "http-status-codes";

export class UserExitsError extends HttpError {
    constructor() {
        super(StatusCodes.CONFLICT, "User already exists!");
    }
}
