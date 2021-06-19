import {Body, CurrentUser, Get, JsonController, Param, Post, QueryParam, Req, Res} from "routing-controllers";
import {LwNewService} from "../../services/NewService";
import {getRepository} from "typeorm";
import {LwNews} from "../../models/LwNews";
import {ResPartner} from "../../models";
import {NewsLikeRequest, NewsViewRequest} from "../../models/dto/NewsRequest";
import express from "express";
import {StatusCodes} from "http-status-codes";

@JsonController("/news")
export class NewsController {
    constructor(
        private _lwNewService: LwNewService,
        private repo = getRepository(LwNews)
    ) {
    };

    @Get("/:news_id")
    public async getNewsDetail(@CurrentUser({required: true}) user: ResPartner,
                               @Param("news_id") newsId: number) {
        return this._lwNewService.getNewsDetail(newsId, user.id);
    }

    @Get()
    getNews(@CurrentUser({required: true}) user: ResPartner,
            @QueryParam("page") page: number,
            @QueryParam("limit") limit: number) {
        return this._lwNewService.getNews(page ? page : 1, limit ? limit : 10, user.id);
    }

    @Post("/like")
    public async like(@CurrentUser({required: true}) user: ResPartner,
                      @Body() data: NewsLikeRequest,
                      @Req() req: express.Request,
                      @Res() res: express.Response) {
        res.status(StatusCodes.NO_CONTENT);
        return this._lwNewService.like(data.news_id, data.like, user.id);
    }

    @Post("/view")
    public async view(@CurrentUser({required: true}) user: ResPartner,
                      @Body() data: NewsViewRequest,
                      @Req() req: express.Request,
                      @Res() res: express.Response) {
        res.status(StatusCodes.NO_CONTENT);
        return this._lwNewService.view(data.news_id, user.id);
    }
}

