import {EntityManager, EntityRepository, Repository} from "typeorm";
import {Service} from "typedi";
import {InjectManager} from "typeorm-typedi-extensions";
import {LwExercise} from "../models";
import {ErrorCode} from "../enums/ErrorCode";
import {PageNotFound} from "../api/errors/PageNotFound";
import {StatusCodes} from "http-status-codes";
import {DateUtils} from "../utils/DateUtils";

@Service()
@EntityRepository(LwExercise)
export class LwExerciseRepository extends Repository<LwExercise> {

    constructor(@InjectManager() private entityManager: EntityManager) {
        super();
    }

    async finishExercise(exerciseId: number, userId: number): Promise<any> {
        const now = DateUtils.dateToString(new Date(), "YYYY-MM-DD");
        const exercisePartner = await this.entityManager.query("SELECT * FROM lw_exercise_partner WHERE exercise_id = $1 AND partner_id = $2 AND finish_date = $3",
            [exerciseId, userId, now]);
        if (exercisePartner && exercisePartner.length > 0)
            throw new Error("Exercise had finished!");
        return this.entityManager.query(`INSERT INTO lw_exercise_partner (exercise_id, partner_id, progress, finish_flag, finish_date) 
        VALUES (${exerciseId}, ${userId}, 1, true,'${now}')`);
    }

    async finishExerciseVideo(exerciseId: number, videoId: number, userId: number): Promise<any> {
        const exerciseVideoId = await this.entityManager.query(
            `SELECT lev.id from lw_exercise_video lev 
            where lev.exercise_id = ${exerciseId} AND lev.video_id = ${videoId}`
        );
        const now = DateUtils.dateToString(new Date(), "YYYY-MM-DD");
        return this.entityManager.query(`INSERT INTO lw_exercise_video_partner (exercise_video_id, partner_id, finish_flag, finish_date) 
        VALUES (${exerciseVideoId[0].id}, ${userId}, true, '${now}')`);
    }

    async checkUserExist(userId: number): Promise<number> {
        const userCount = await this.entityManager.query("SELECT count(res_partner.id) from res_partner where id = " + userId);
        return parseInt(userCount[0]["count"]);
    }

    async checkExerciseExist(exerciseId: number): Promise<number> {
        const exCount = await this.entityManager.query("SELECT count(lw_exercise.id) from lw_exercise where id = " + exerciseId);
        return parseInt(exCount[0]["count"]);
    }

    async paginate(page: number, limit: number, partnerId: number, dayOfWeek: string, finishDate: string): Promise<any> {
        const data = await this.entityManager.query(`select count(1) from lw_exercise le 
            inner join lw_exercise_week lew on le.id = lew.exercise_id 
            where lew.day_of_week  = $1`, [dayOfWeek]);
        let nextPage = true;
        const from = ((page - 1) * limit);
        const to = page * limit;

        let result = [];
        let total = 0;
        if (data.length > 0) {
            total = data[0].count;
            if (to >= total)
                nextPage = false;
            const dayOfWeek = DateUtils.dow(finishDate);
            result = await this.entityManager.query(`select le.id, le.image, le."name",
                (select COUNT(1) from lw_video lv INNER JOIN lw_exercise_video lev1 ON lev1.video_id = lv.id WHERE lev1.exercise_id = le.id) AS total_items, 
                (select lep.finish_flag from lw_exercise_partner lep WHERE lep.exercise_id = le.id and lep.partner_id = $3 and lep.finish_date = $4) AS is_finished 
                from lw_exercise le inner join lw_exercise_week lew on le.id = lew.exercise_id 
                where lew.day_of_week  = $5 LIMIT $1 OFFSET $2`,
                [limit, from, partnerId, finishDate, dayOfWeek]
            );
        }
        const weightlossArr = await this.entityManager.query(`SELECT lwa.id FROM lw_weightloss_area_partner lwap 
                INNER JOIN lw_weightloss_area lwa ON lwa.id = lwap.weightloss_area_id 
                where lwap.partner_id = $1`, [partnerId]);

        const weightlossAreaIds = weightlossArr.map(function (wl: any) {
            return wl.id;
        });

        let randomEx = [];
        if (weightlossAreaIds && weightlossAreaIds.length > 0) {
            randomEx = await this.entityManager.query(`select le.id, le.image, le."name",
            false as is_finished, (select COUNT(1) from lw_video lv 
            INNER JOIN lw_exercise_video lev1 ON lev1.video_id = lv.id WHERE lev1.exercise_id = le.id) AS total_items 
            from lw_exercise le inner join lw_exercise_lw_weightloss_area_rel lelwarl on lelwarl.lw_exercise_id = le.id 
            where lelwarl.lw_weightloss_area_id in (${weightlossAreaIds}) LIMIT 1 OFFSET 0`);
        }

        return {
            data: [...result, ...randomEx],
            page,
            limit,
            from: from + 1,
            to,
            total,
            nextPage
        };
    }

    async getByArea(area: string, page: number, limit: number): Promise<any> {
        const skippedItems = (page - 1) * limit;
        const select_query = `Select le.id, le.name, le.image, (select count(*) from lw_exercise_video lev
            where lev.exercise_id = le.id) as total_items `;
        const query = `from lw_exercise le inner join lw_exercise_lw_weightloss_area_rel lelw
            on le.id = lelw.lw_exercise_id inner join lw_weightloss_area lwa on lwa.id =
            lelw.lw_weightloss_area_id where lwa.name = '${area}'`;

        const count = await this.entityManager.query("SELECT COUNT(*) " + query);
        const total = parseInt(count[0]["count"]);
        const total_page = Math.ceil(total / limit);
        let to = 0;
        let nextPage = true;
        if (total > page * limit) {
            to = page * limit;
        } else if (page > total_page && total_page != 0) {
            throw new PageNotFound(ErrorCode.PAGE_NOT_EXIST);
        } else {
            to = total;
            nextPage = false;
        }

        const result = await this.entityManager.query(select_query + query + "LIMIT " + limit + " OFFSET " + skippedItems);

        return {
            data: result,
            page,
            limit,
            from: skippedItems + 1,
            to,
            total,
            nextPage
        };
    }

    async putMuscle(userId: number, muscle: Array<string>) {
        const del = await this.entityManager.query(`Delete from lw_weightloss_area_partner lwap
            where lwap.partner_id = ${userId}
        `);
        for (const i in muscle) {
            this.entityManager.query(`Insert into lw_weightloss_area_partner (partner_id, weightloss_area_id, active)
                              values (${userId}, (select lwa.id from lw_weightloss_area lwa where lwa.name = '${muscle[i]}'),
                              true )`);
        }
        return {"status": StatusCodes.OK};
    }
}
