import {EntityManager, EntityRepository, Repository} from "typeorm";
import {Service} from "typedi";
import {InjectManager} from "typeorm-typedi-extensions";
import {LwExerciseVideo} from "../models";

@Service()
@EntityRepository(LwExerciseVideo)
export class LwExerciseVideoRepository extends Repository<LwExerciseVideo> {

    constructor(@InjectManager() private entityManager: EntityManager) {
        super();
    }

    async findInId(ids: number[]): Promise<any> {
        return await this.createQueryBuilder("exVideos")
            .select(["exVideos.video.video_name", "exVideos.video.url"])
            .innerJoinAndSelect("exVideos.video", "video")
            .where("exVideos.id IN (:...ids)", {ids: ids})
            .getMany();
    }

    async findByExercise(idExercise: number): Promise<any> {
        return await this.createQueryBuilder("exVideos")
            .select("exVideos.video")
            .innerJoinAndSelect("exVideos.exercise", "exercise", "exercise.id = :id_exercise", {id_exercise: idExercise})
            .innerJoinAndSelect("exVideos.video", "video")
            .getOne();
    }
}
