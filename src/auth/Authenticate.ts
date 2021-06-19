import jwt from "jsonwebtoken";
import {Action} from "routing-controllers";
import Container from "typedi";
import {ResPartnerService} from "../services/ResPartnerService";

export interface Itoken {
    phone: string;
    iat: number;
    exp: number;
}

export class Authentication {
    static isToken(token: string) {
        return /Bearer\s[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/.test(token);
    }

    static generateToken(phone: string): string {
        const token = jwt.sign({phone}, process.env.JWT_SECRET || "", {
            algorithm: "HS512",
            expiresIn: "365d",
        });
        return `Bearer ${token}`;
    }

    static verifyToken(token: string): boolean {
        const data: Itoken = jwt.verify(
            token,
            process.env.JWT_SECRET || "",
            {algorithms: ["HS512"]},
        ) as Itoken;

        if (data.iat * 1000 - new Date().getTime() > 0) return false;
        if (data.exp * 1000 - new Date().getTime() <= 0) return false;
        return true;
    }

    static refreshToken(token: string): string {
        const data: Itoken = jwt.verify(
            token,
            process.env.JWT_SECRET || "",
            {algorithms: ["HS512"]},
        ) as Itoken;
        if (data.exp - new Date().getTime() / 1000 < 60 * 60) {
            return Authentication.generateToken(data.phone);
        }
        return token;
    }

    static getUserIdByToken(token: string): Pick<Itoken, "phone"> {
        return jwt.verify(token, process.env.JWT_SECRET || "", {
            algorithms: ["HS512"],
        }) as Pick<Itoken, "phone">;
    }

    static async currentUserChecker(action: Action) {
        const bearerToken = action.request.headers.authorization;
        if (!Authentication.isToken(bearerToken)) {
            return false;
        }
        const token = bearerToken.replace(/Bearer\s/, "");
        if (!Authentication.verifyToken(token)) {
            return false;
        }
        const userService = Container.get(ResPartnerService);
        const phone = Authentication.getUserIdByToken(token).phone;
        const user = await userService.getByPhone(phone);

        action.request.query.user = user[0];
        return user[0];
    }
}
