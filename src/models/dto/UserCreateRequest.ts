import {IsArray, IsEmail, IsString, Matches} from "class-validator";

export class UserCreateRequest {
    @IsEmail()
    email!: string;

    @IsString()
    name!: string;

    @IsString()
    password!: string;

    @Matches(RegExp(/^([0-2][0-9]{3})-(0[1-9]|1[0-2])-([0-2][0-9]|3[0-1])?$/))
    dob!: string;

    @IsString()
    gender!: string;

    phone!: string;

    @IsString()
    address!: string;

    height!: number;

    weight!: number;

    target_weight!: number;

    @IsString()
    physical!: string;

    @IsArray()
    muscle!: string[];
}
