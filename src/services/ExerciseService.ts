import {Service} from "typedi";
import {BaseService} from "./BaseService";
import {OrmRepository} from "typeorm-typedi-extensions";
import {LwExercise} from "../models/LwExercise";
import {IPaginationOptions, Pagination} from "nestjs-typeorm-paginate/dist";
import {LwExerciseRepository} from "../repositories/LwExerciseRepository";
import {UserNotFoundError} from "../api/errors/UserNotFoundError";
import {ExerciseNotFoundError} from "../api/errors/ExerciseNotFoundError";
import {ErrorCode} from "../enums/ErrorCode";
import {AreaNotFoundError} from "../api/errors/AreaNotFoundError";
import {LwExerciseVideoRepository} from "../repositories/LwExerciseVideoRepository";
import {LwVideoRepository} from "../repositories/LwVideoRepository";
import {DateUtils} from "../utils/DateUtils";

@Service()
export class ExerciseService extends BaseService<LwExercise> {
    constructor(@OrmRepository() private lwExerciseRepository: LwExerciseRepository,
                @OrmRepository() private lwExerciseVideoRepository: LwExerciseVideoRepository,
                @OrmRepository() private lwVideoRepository: LwVideoRepository) {
        super(LwExercise);
    }

    public async getById(id: number, page: number = 1, pageSize: number = 10, partnerId: number, date: string): Promise<any> {
        return await this.lwVideoRepository.findByExerciseId(id, page, pageSize, partnerId, date);
    }

    async paginate(options: IPaginationOptions, partnerId: number, date: string): Promise<Pagination<LwExercise>> {
        const dayOfWeek = DateUtils.dow(date);
        return await this.lwExerciseRepository.paginate(options.page, options.limit, partnerId, dayOfWeek, date);
    }

    public async finishExercise(exerciseId: number, userId: number): Promise<any> {
        const isUserExist = await this.lwExerciseRepository.checkUserExist(userId);
        const isExExist = await this.lwExerciseRepository.checkExerciseExist(exerciseId);

        if (isUserExist == 0) {
            throw new UserNotFoundError();
        }
        if (isExExist == 0) {
            throw new ExerciseNotFoundError(ErrorCode.EXERCISE_NOT_EXIST);
        }
        return this.lwExerciseRepository.finishExercise(exerciseId, userId);
    }

    public async finishExerciseVideo(exerciseId: number, videoId: number, userId: number): Promise<any> {
        const isUserExist = await this.lwExerciseRepository.checkUserExist(userId);
        const isExExist = await this.lwExerciseRepository.checkExerciseExist(exerciseId);
        if (isUserExist == 0) {
            throw new UserNotFoundError();
        }
        if (isExExist == 0) {
            throw new ExerciseNotFoundError(ErrorCode.EXERCISE_NOT_EXIST);
        }
        return this.lwExerciseRepository.finishExerciseVideo(exerciseId, videoId, userId);
    }

    public async getByArea(area: string = "body", page: number = 1, limit: number = 10): Promise<any> {
        const list_area = ["hand", "body", "stomach", "foot"];
        if (list_area.includes(area)) {
            return this.lwExerciseRepository.getByArea(area, page, limit);
        }
        throw new AreaNotFoundError("404");
    }

    public async putMuscle(userId: number, muscle: Array<string> = []): Promise<any> {
        return this.lwExerciseRepository.putMuscle(userId, muscle);
    }

}
