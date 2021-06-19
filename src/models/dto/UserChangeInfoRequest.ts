import {IsEmail, IsString} from "class-validator";
import {JsonProperty} from "json-object-mapper";

export class UserCreateRequest {
    @IsEmail()
    email!: string;

    @IsString()
    address!: string;

    @IsString()
    muscle!: string;

    @JsonProperty({name: "create_date"})
    createDate!: string;

    @JsonProperty({name: "write_date"})
    writeDate!: string;
}
