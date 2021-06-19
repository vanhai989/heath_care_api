import {IsNotEmpty, IsString} from "class-validator";
import {Match} from "../../decorator/validate/match.decorator";

export class UserChangePasswordRequest {

    @IsString()
    old_pass!: string;

    @IsString()
    @IsNotEmpty()
    new_pass!: string;

    @IsString()
    @Match("new_pass")
    confirm_pass!: string;
}
