import {Action} from "routing-controllers";
import {Container} from "typedi";
import {Connection} from "typeorm";
import {Authentication} from "./Authenticate";

export function authorizationChecker(connection: Connection): (action: Action, roles: any[]) => Promise<boolean> | boolean {
    const authService = Container.get(Authentication);

    return async function innerAuthorizationChecker(action: Action, roles: string[]): Promise<boolean> {
        // here you can use request/response objects from action
        // also if decorator defines roles it needs to access the action
        // you can use them to provide granular access check
        // checker must return either boolean (true or false)
        // either promise that resolves a boolean value
        // const credentials = authService.parseBasicAuthFromRequest(action.request);
        //
        // if (credentials === undefined) {
        //     console.warn("No credentials given");
        //     return false;
        // }
        //
        // action.request.user = await authService.validateUser(credentials.username, credentials.password);
        // if (action.request.user === undefined) {
        //     console.warn("Invalid credentials given");
        //     return false;
        // }
        //
        // console.info("Successfully checked credentials");
        return true;
    };
}
