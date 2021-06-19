import {Service} from "typedi";
import {EntityRepository, Repository} from "typeorm";
import {LwNewsTrace} from "../models/LwNewsTrace";

@Service()
@EntityRepository(LwNewsTrace)
export class LwNewTraceRepository extends Repository<LwNewsTrace> {

    async view(newsId: number, userId: number) {
        const resultNewTrace = await this.createQueryBuilder()
            .select("COUNT(*)")
            .from(LwNewsTrace, "lnt")
            .where(`lnt.news_id = ${newsId}`)
            .andWhere(`lnt.partner_id = ${userId}`)
            .getRawMany();

        if (+resultNewTrace[0].count === 0) {
            const now = new Date();
            return this.createQueryBuilder()
                .insert()
                .into(LwNewsTrace,
                    ["partner_id", "news_id", "like_flg", "read_flg", "create_date", "write_date"])
                .values(
                    {
                        "partner": userId,
                        "news": newsId,
                        likeFlg: false,
                        readFlg: true,
                        createDate: now,
                        writeDate: now,
                    }
                )
                .execute();
        }
    }
}
