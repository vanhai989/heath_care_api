import {Container} from "typedi";
import {createConnection, useContainer} from "typeorm";

import {typeOrmConfig} from "./config";

export async function connectDatabase() {
    useContainer(Container);
    return createConnection(typeOrmConfig);
}
