export const routingControllerOptions = {
    // You should put currentUserChecker to use CurrentUser() in Controller
    // currentUserChecker: Authentication.currentUserChecker,
    controllers: [__dirname + "/src/api/controllers/*{.js,.ts}"],
    middlewares: [`${__dirname}/src/middlewares/*{.js,.ts}`],
    // interceptors: [`${__dirname}/../interceptor/*.[jt]s`],
};
