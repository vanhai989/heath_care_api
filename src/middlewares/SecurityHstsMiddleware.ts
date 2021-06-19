//
// @Middleware({type: "before"})
// export class SecurityHstsMiddleware implements ExpressMiddlewareInterface {
//     public use(req: express.Request, res: express.Response, next: express.NextFunction): any {
//         return helmet.hsts({
//             maxAge: 31536000,
//             includeSubDomains: true,
//         })(req, res, next);
//     }
// }
