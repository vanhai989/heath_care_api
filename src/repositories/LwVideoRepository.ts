import {EntityManager, EntityRepository, Repository} from "typeorm";
import {Service} from "typedi";
import {InjectManager} from "typeorm-typedi-extensions";
import {LwVideo} from "../models";

@Service()
@EntityRepository(LwVideo)
export class LwVideoRepository extends Repository<LwVideo> {

    constructor(@InjectManager() private entityManager: EntityManager) {
        super();
    }

    async findByExerciseId(exerciseId: number, page: number, pageSize: number, partnerId: number, viewDate: string): Promise<any> {
        let nextPage = true;
        const from = ((page - 1) * pageSize);
        const to = page * pageSize;

        const count = await this.entityManager.query(
            `SELECT count(1) FROM lw_video lv 
            INNER JOIN lw_exercise_video lev ON lv.id = lev.video_id 
            WHERE lev.exercise_id = ${exerciseId} LIMIT $1 OFFSET $2`, [pageSize, from]
        );

        if (!count && count.length <= 0)
            return [];
        const result = await this.entityManager.query(
            `SELECT lv.id, lv.image, lv.video_name as name, lv.url as video, lv.description,
            levp.finish_flag as is_finished FROM lw_video lv 
            INNER JOIN lw_exercise_video lev ON lv.id = lev.video_id 
            LEFT JOIN lw_exercise_video_partner levp ON levp.exercise_video_id = lev.id 
            AND levp.partner_id = $4  
            AND levp.finish_date = $3 
            WHERE lev.exercise_id = $5 GROUP BY lv.id, levp.finish_flag LIMIT $1 OFFSET $2`,
            [pageSize, from, viewDate, partnerId, exerciseId]);

        const total = count[0].count;
        if (to >= total)
            nextPage = false;

        return {
            data: result,
            page,
            pageSize,
            from: from + 1,
            to,
            total,
            nextPage
        };
    }
}
