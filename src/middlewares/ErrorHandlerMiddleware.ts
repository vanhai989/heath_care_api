import * as express from "express";
import {ExpressErrorMiddlewareInterface, HttpError, Middleware} from "routing-controllers";
import {StatusCodes} from "http-status-codes";

@Middleware({type: "after"})
export class ErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {

    public error(error: HttpError, req: express.Request, res: express.Response, next: express.NextFunction): void {
        res.status(error.httpCode || StatusCodes.INTERNAL_SERVER_ERROR);
        if (error.name === "TokenExpiredError")
            res.status(StatusCodes.UNAUTHORIZED);
        res.json({
            name: error.name,
            message: error.message,
        });
    }
}
