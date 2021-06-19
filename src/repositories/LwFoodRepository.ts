import {EntityManager, EntityRepository, Repository} from "typeorm";
import {Service} from "typedi";
import {LwFood} from "../models/LwFood";
import {InjectManager} from "typeorm-typedi-extensions";
import {LwFoodStar} from "../models/LwFoodStar";
import {RatingRequest} from "../models/dto/RatingRequest";
import {FoodNotFoundError} from "../api/errors/FoodNotFoundError";
import {ErrorCode} from "../enums/ErrorCode";
import {LwFoodCategory} from "../models";
import {PageNotFound} from "../api/errors/PageNotFound";
import {LwFoodMenuPartner} from "../models/LwFoodMenuPartner";
import logger from "../lib/logger/logger";
import {DateUtils} from "../utils/DateUtils";

@Service()
@EntityRepository(LwFood)
export class LwFoodRepository extends Repository<LwFood> {

    constructor(@InjectManager() private entityManager: EntityManager) {
        super();
    }


    async findByNameAndCategory(search_text: string, category: string, page: number, limit: number, user_id: number):
        Promise<{ total: number; data: any; nextPage: boolean; limit: number; from: number; page: number; to: number }> {
        const skippedItems = (page - 1) * limit;
        const select_query =
            `SELECT DISTINCT lf.id, lf.image, lf.name, lf.calo,lf.description,
            (select lfs1.star as user_star from lw_food_star lfs1  where lfs1.res_partner_id = ${user_id} and lfs1.food_id = lf.id),
            (SELECT COUNT(1) FROM lw_food_star lfs WHERE lfs.res_partner_id = ${user_id} AND lfs.like_flag = 1 
            AND lfs.food_id = lf.id)::INTEGER AS heart,(SELECT round(AVG(lfs.star)) FROM lw_food_star lfs 
            WHERE lfs.food_id = lf.id)::INTEGER AS star `;

        let query =
            `FROM lw_food lf LEFT JOIN lw_food_star lfs ON lfs.food_id = lf.id inner join lw_food_category lfc 
            on lfc.food_id = lf.id inner join lw_category lc on lc.code = lfc.category_code `;
        let condition = "";

        if (category == "") {
            condition = `WHERE lf.name LIKE '%${search_text}%'`;
            query = "FROM lw_food lf LEFT JOIN lw_food_star lfs ON lfs.food_id = lf.id ";
        } else {
            condition = `WHERE lf.name LIKE '%${search_text}%'and lc.code = '${category}' `;
        }
        let count = await this.entityManager.query(`SELECT COUNT(DISTINCT(lf.id)) ${query} ${condition}`);
        if (category == "food-like") {
            count = await this.entityManager.query(`SELECT COUNT(DISTINCT(lf.id)) ${query} ${condition} AND lfc.partner_id = ${user_id}`);
        }

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

        let result = await this.entityManager.query(select_query + query + condition + "LIMIT " + limit + " OFFSET " + skippedItems);
        if (category == "food-like") {
            result = await this.entityManager.query(select_query + query + condition + "AND lfc.partner_id = " + user_id + "LIMIT " + limit + " OFFSET " + skippedItems);
        }

        const data = {
            data: result,
            page,
            limit,
            from: skippedItems + 1,
            to,
            total,
            nextPage
        };

        return data;
    };

    async getById(id: number, partnerId: number): Promise<any> {
        // const data = this.entityManager.query("SELECT lf.name FROM lw_food AS lf WHERE lf.name = $1 AND lf.lastName = $2", ["John", "Doe"]);
        const data = await this.entityManager.query(`SELECT lf.id, lf.image, lf.name, lf.calo, lfs.like_flag as is_like, lfs.star as user_star, lf.description, 
            (SELECT COUNT(1) FROM lw_food_star lfs2 WHERE lfs2.like_flag = 1 AND lfs2.food_id = lf.id)::INTEGER AS heart, 
            (select round(avg(lfs1.star)) from lw_food_star lfs1 where lfs1.food_id = lf.id)::INTEGER as star_avg 
            FROM lw_food AS lf 
            left join lw_food_star lfs on lfs.food_id = lf.id and lfs.res_partner_id = ${partnerId} 
            WHERE lf.id = ${id}`);
        if (Array.isArray(data) && data.length)
            return data[0];
        throw new FoodNotFoundError(ErrorCode.FOOD_NOT_FOUND);
    }

    async rating(rating: RatingRequest, resPartnerId: number): Promise<any> {
        const result = await this.createQueryBuilder()
            .select("lw_food_star")
            .from(LwFoodStar, "lw_food_star")
            .where("lw_food_star.foodId = :food_id", {food_id: rating.food_id})
            .andWhere("lw_food_star.resPartnerId = :partner_id", {partner_id: resPartnerId})
            .getOne();
        if (result) {
            return await this.createQueryBuilder()
                .update(LwFoodStar)
                .set({star: rating.star})
                .where("foodId = :food_id", {food_id: rating.food_id})
                .andWhere("resPartnerId = :partner_id", {partner_id: resPartnerId})
                .execute();
        } else {
            return await this.createQueryBuilder()
                .insert()
                .into(LwFoodStar)
                .values({
                    foodId: rating.food_id,
                    resPartnerId: resPartnerId,
                    star: rating.star
                }).execute();
        }
    }

    async like(foodId: number, resPartnerId: number, likeFlag: number): Promise<any> {
        const result = await this.createQueryBuilder()
            .select("lw_food_star")
            .from(LwFoodStar, "lw_food_star")
            .where("lw_food_star.foodId = :food_id", {food_id: foodId})
            .andWhere("lw_food_star.resPartnerId = :partner_id", {partner_id: resPartnerId})
            .getOne();

        const foodCategory = await this.createQueryBuilder()
            .select("lw_food_category")
            .from(LwFoodCategory, "lw_food_category")
            .where("lw_food_category.foodId = :food_id", {food_id: foodId})
            .andWhere("lw_food_category.partnerId = :partner_id", {partner_id: resPartnerId})
            .andWhere("lw_food_category.category_code = 'food-like'")
            .getOne();

        if (!foodCategory) {
            this.createQueryBuilder()
                .insert()
                .into(LwFoodCategory)
                .values({foodId: foodId, categoryCode: "food-like", partnerId: resPartnerId})
                .execute();
        }

        if (result) {
            return await this.createQueryBuilder()
                .update(LwFoodStar)
                .set({likeFlag: likeFlag})
                .where("foodId = :food_id", {food_id: foodId})
                .andWhere("resPartnerId = :partner_id", {partner_id: resPartnerId})
                .execute();
        } else {
            return await this.createQueryBuilder()
                .insert()
                .into(LwFoodStar)
                .values({
                    foodId: foodId,
                    resPartnerId: resPartnerId,
                    likeFlag: likeFlag
                }).execute();
        }
    }

    async changeFood(data: { foodId: number; menuCode: string; partnerId: number; dayOfWeek: string }[], foodDeleteIds: number[], partnerId: number): Promise<any> {
        if (foodDeleteIds && foodDeleteIds.length > 0) {
            const deleteResponse = await this.createQueryBuilder()
                .delete()
                .from(LwFoodMenuPartner)
                .where("food_id IN (:...idFoods)", {idFoods: foodDeleteIds})
                .andWhere("partner_id = :idUser", {idUser: partnerId})
                .execute();
            logger.info(`Delete all food menu ids: ${deleteResponse}`);
        }
        if (!data || data.length <= 0) {
            return null;
        }
        return await this.createQueryBuilder()
            .createQueryBuilder()
            .insert()
            .into(LwFoodMenuPartner)
            .values(data)
            .execute();
    }

    async findFoodByDateCategory(
        day_of_week: string,
        menu: string,
        user_id: number,
        page: number,
        limit: number):
        Promise<any> {

        const dow = DateUtils.dow(day_of_week);
        const is_exist = await this.entityManager.query(`select count(id) from lw_food_menu_partner lfmp where lfmp.menu_code = 
                                                       '${menu}' and lfmp.partner_id = ${user_id} and lfmp.day_of_week= '${dow}'`);
        if (parseInt(is_exist[0]["count"]) == 0) {
            const food_ids = await this.entityManager.query(`Select lflmr.lw_food_id from lw_food_lw_menu_rel
                            lflmr inner join lw_diet ld on ld.lw_menu_id = lflmr.lw_menu_id where ld.lw_week_id = (
                            select lw.id from lw_week lw where lw.day_of_week = '${dow}') and ld.lw_menu_id = 
                            (select lm.id from lw_menu lm where lm.code = '${menu}') `);
            for (const food_id in food_ids) {
                await this.entityManager.query(`Insert into lw_food_menu_partner(food_id, menu_code, partner_id ,day_of_week) 
                                                         values(${parseInt(food_ids[food_id]["lw_food_id"])}, '${menu}', ${user_id}, '${dow}')`);

            }
        }
        const skippedItems = (page - 1) * limit;
        const select_query =
            `SELECT DISTINCT lf.id, lf.image, lf.name, lf.calo,lf.description,(select lfs.star from lw_food_star
             lfs where lfs.res_partner_id = ${user_id} and lfs.food_id = lf.id) AS user_star,
            (SELECT COUNT(1) FROM lw_food_star lfs WHERE lfs.res_partner_id = ${user_id}  AND lfs.like_flag = 1 
            AND lfs.food_id = lf.id)::INTEGER AS heart,(SELECT round(AVG(lfs.star)) FROM lw_food_star lfs 
            where lfs.food_id = lf.id)::INTEGER AS star `;

        const query = ` from lw_food lf inner join lw_food_menu_partner lfmp on lf.id = lfmp.food_id 
                      where lfmp.menu_code = '${menu}' and lfmp.partner_id = ${user_id} and lfmp.day_of_week= '${dow}'`;


        const count = await this.entityManager.query(`select count(id) from lw_food_menu_partner lfmp
         where lfmp.menu_code = '${menu}' and lfmp.partner_id = ${user_id} and lfmp.day_of_week= '${dow}'`);
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

        const data = {
            data: result,
            page,
            limit,
            from: skippedItems + 1,
            to,
            total,
            nextPage,
        };

        return data;
    }

    public async findFoodByCategory(category: string, page: number, limit: number, user_id: number): Promise<any> {
        const skippedItems = (page - 1) * limit;
        const select_query =
            "SELECT DISTINCT lf.id, lf.image, lf.name, lf.calo,lf.description, " +
            "(select lfs1.star as user_star from lw_food_star lfs1  where lfs1.res_partner_id = " + user_id + " and lfs1.food_id = lf.id)," +
            "(SELECT COUNT(1) FROM lw_food_star lfs WHERE lfs.res_partner_id = " + user_id + " AND lfs.like_flag = 1 " +
            "AND lfs.food_id = lf.id)::INTEGER AS heart,(SELECT round(AVG(lfs.star)) FROM lw_food_star lfs WHERE lfs.res_partner_id = " + user_id + " " +
            "AND lfs.food_id = lf.id)::INTEGER AS star ";
        const query =
            "FROM lw_food lf LEFT JOIN lw_food_star lfs ON lfs.food_id = lf.id inner join lw_food_category lfc " +
            "on lfc.food_id = lf.id inner join lw_category lc on lc.code = lfc.category_code ";
        const condition = "WHERE lc.code = '" + category + "'";
        let count = await this.entityManager.query("SELECT COUNT(DISTINCT(lf.id)) " + query + condition);
        if (category == "food-like") {
            count = await this.entityManager.query("SELECT COUNT(DISTINCT(lf.id)) " + query + condition + "AND lfc.partner_id = " + user_id);
        }
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

        let result = await this.entityManager.query(select_query + query + condition + "LIMIT " + limit + " OFFSET " + skippedItems);

        if (category == "food-like") {
            result = await this.entityManager.query(select_query + query + condition + "AND lfc.partner_id = " + user_id + "LIMIT " + limit + " OFFSET " + skippedItems);
        }

        const data = {
            data: result,
            page,
            limit,
            from: skippedItems + 1,
            to,
            total,
            nextPage
        };
        return data;
    }

    public async finishDiet(menuCode: string, dow: string, userId: number): Promise<any> {
        const diet = await this.entityManager.query(`Select lfmp.id from lw_food_menu_partner lfmp 
                    inner join lw_menu lm on lm.code = lfmp.menu_code 
                    inner join lw_week lw on lw.day_of_week = lfmp.day_of_week 
                    where lw.day_of_week = $1 
                    and lm.code = $2 
                    and lfmp.partner_id = $3`, [dow, menuCode, userId]);

        const diet_id = parseInt(diet[0]["id"]);
        const date = new Date().toISOString();
        return await this.entityManager
            .query(`Insert into lw_food_menu_partner_today (lw_food_menu_partner_id, status, created_date) 
            values ('${diet_id}', ${true}, '${date}')`);
    }
}
