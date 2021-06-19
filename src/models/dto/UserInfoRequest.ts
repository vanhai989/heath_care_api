import {IsEmail, IsString} from "class-validator";

export class UserInfoRequest {
    @IsEmail()
    email!: string;

    @IsString()
    name!: string;

    @IsString()
    address!: string;

    weight!: number;

    height!: number;
}
