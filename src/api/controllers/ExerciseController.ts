import {Body, Get, JsonController, Put, QueryParam} from "routing-controllers";
import express from "express";
import {Param} from "routing-controllers/decorator/Param";
import {Req} from "routing-controllers/decorator/Req";
import {Res} from "routing-controllers/decorator/Res";
import {ExerciseService} from "../../services/ExerciseService";
import {ResPartner} from "../../models";
import {CurrentUser} from "routing-controllers/decorator/CurrentUser";
import {StatusCodes} from "http-status-codes";

@JsonController("/exercise-regimes")
export class ExerciseController {

    constructor(
        private _exerciseService: ExerciseService
    ) {
    }

    @Get()
    public async search(@CurrentUser({required: true}) user: ResPartner,
                        @QueryParam("date") date: string,
                        @QueryParam("page") page: number,
                        @QueryParam("page_size") pageSize: number,
                        @Req() req: express.Request, @Res() res: express.Response) {
        return this._exerciseService.paginate({page: page ? page : 1, limit: pageSize ? pageSize : 10}, user.id, date);
    }

    @Get("/area")
    public async getExByArea(
        @QueryParam("area") area: string,
        @QueryParam("page") page: number,
        @QueryParam("limit") limit: number,
        @CurrentUser({required: true}) user: ResPartner
    ): Promise<any> {
        return this._exerciseService.getByArea(area, page, limit);
    }

    @Get("/:exercise_id")
    public async getById(@CurrentUser({required: true}) user: ResPartner,
                         @Param("exercise_id") exerciseId: number,
                         @QueryParam("date") date: string,
                         @QueryParam("page") page: number,
                         @QueryParam("page_size") pageSize: number,
                         @Req() req: express.Request, @Res() res: express.Response) {
        return this._exerciseService.getById(exerciseId, page, pageSize, user.id, date);
    }

    @Put("/finish")
    public async finishExercise(
        @Body() data: any,
        @Res() res: express.Response,
        @CurrentUser({required: true}) user: ResPartner): Promise<any> {
        res.status(StatusCodes.NO_CONTENT);
        return this._exerciseService.finishExercise(data.exercise_id, user.id);
    }

    @Put("/finish-video")
    public async finishExerciseVideo(
        @CurrentUser({required: true}) user: ResPartner,
        @Res() res: express.Response,
        @Body() data: any,
    ): Promise<any> {
        res.status(StatusCodes.NO_CONTENT);
        return this._exerciseService.finishExerciseVideo(data.exercise_id, data.video_id, user.id);
    }

    @Put("/muscle")
    public async putMuscle(
        @CurrentUser({required: true}) user: ResPartner,
        @Body() data: any): Promise<any> {
        const userId = user.id;
        return this._exerciseService.putMuscle(userId, data.muscles);
    }
}
