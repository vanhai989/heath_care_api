import {IsString} from "class-validator";

export class FoodCreateRequest {
    @IsString()
    name!: string;

    calo!: number;

    @IsString()
    description!: string;
}
