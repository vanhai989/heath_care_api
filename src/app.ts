import "reflect-metadata";
import "./utils/env";
import {connectDatabase} from "./database/db";
import {authorizationChecker} from "./auth/authorizationChecker";
import {getConnection} from "typeorm";
import {Container} from "typedi";
import {createExpressServer, useContainer} from "routing-controllers";
import {Authentication} from "./auth/Authenticate";

useContainer(Container);

const PORT = process.env.PORT || 5000;

async function startApplication() {
    try {
        await connectDatabase();
        const connection = getConnection();
        console.log("Database is connected successfully");
        const app = createExpressServer({
            controllers: [`${__dirname}/api/controllers/*{.js,.ts}`],
            middlewares: [`${__dirname}/middlewares/*{.js,.ts}`],
            authorizationChecker: authorizationChecker(connection),
            currentUserChecker: Authentication.currentUserChecker,
            defaultErrorHandler: false,
        });
        app.listen(PORT);
    } catch (err) {
        console.error(err);
        throw err;
    }
}

startApplication().then(() => {
    console.log(`Server is running on ${PORT}`);
});
