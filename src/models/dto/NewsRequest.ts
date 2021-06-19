import {IsBoolean, IsNumber} from "class-validator";

export class NewsLikeRequest {
    @IsNumber()
    news_id!: number;

    @IsBoolean()
    like: boolean;
}

export class NewsViewRequest {
    @IsNumber()
    news_id!: number;

}
