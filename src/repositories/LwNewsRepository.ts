import {Service} from "typedi";
import {EntityRepository, Repository} from "typeorm";
import {LwNews} from "../models/LwNews";
import {LwNewsTrace} from "../models/LwNewsTrace";
import {ResPartner} from "../models";

@Service()
@EntityRepository(LwNews)
export class LwNewsRepository extends Repository<LwNews> {
    async getNewsDetail(newsId: number, userId: number): Promise<LwNews[]> {

        const data = await this.query(`select ln2.id, ln2.image_url_list, ln2.title,
             (select count(*) from lw_news_trace lnt where lnt.news_id = ${newsId} and lnt.like_flg = true) as total_like,
             (select count(*) from lw_news_trace lnt where lnt.news_id = ${newsId} and lnt.read_flg = true) as total_views,
             (select count(*) from lw_news_trace lnt where lnt.news_id  = ${newsId} and lnt.like_flg = true and lnt.partner_id = ${userId}) as like_flag,
             ln2.description from lw_news ln2 where ln2.id = ${newsId}`);
        return data;
    }

    async getNews(page: number, limit: number, userId: number) {
        const skippedItems = (page - 1) * limit;
        const data = await this.query(`select ln2.id, ln2.image_url_list, ln2.title, substring(ln2.description from 1 for 500) as description,
             (select count(lnt.id) from lw_news_trace lnt where lnt.news_id = ln2.id and lnt.like_flg = true) as total_like,
             (select count(lnt.id) from lw_news_trace lnt where lnt.news_id  = ln2.id and lnt.read_flg = true) as total_views,
             (select count(lnt.id) from lw_news_trace lnt where lnt.news_id  = ln2.id and lnt.like_flg = true and lnt.partner_id = ${userId}) as like_flag 
             from lw_news ln2 group by id order by id asc limit ${limit} offset ${skippedItems} `);
        let count = [];
        count = await this.query("select count(*) as counter from lw_news");
        const total = Number(count[0].counter);
        let to = 0;
        let nextPage = true;
        if (total > page * limit) {
            to = page * limit;
        } else {
            to = total;
            nextPage = false;
        }
        return {
            data,
            page,
            limit,
            from: skippedItems + 1,
            to,
            total,
            nextPage
        };
    }

    async like(newsId: number, likeFlag: boolean, userId: number) {
        const resultNew = await this.createQueryBuilder()
            .select("*")
            .from(LwNews, "lw_news")
            .where(`lw_news.id = ${newsId}`)
            .getRawOne();
        const resultNewTrace = await this.createQueryBuilder()
            .select("*")
            .from(LwNewsTrace, "lnt")
            .where(`lnt.news_id = ${newsId}`)
            .andWhere(`lnt.partner_id = ${userId}`)
            .getRawMany();
        if (resultNew && resultNewTrace.length) {
            return this.createQueryBuilder()
                .update(LwNewsTrace)
                .set({likeFlg: likeFlag})
                .where(`news_id = ${newsId}`)
                .andWhere(`partner_id = ${userId}`)
                .execute();
        }
        if (resultNew && !resultNewTrace.length) {
            const resPartner = new ResPartner();
            resPartner.id = userId;
            const lwNews = new LwNews();
            lwNews.id = newsId;
            const now = new Date();
            return this.createQueryBuilder()
                .insert()
                .into(LwNewsTrace,
                    ["partner_id", "news_id", "like_flg", "read_flg", "create_date", "write_date"])
                .values(
                    {
                        "partner": userId,
                        "news": newsId,
                        likeFlg: true,
                        readFlg: true,
                        createDate: now,
                        writeDate: now,
                    }
                )
                .execute();
        }
    }

}
