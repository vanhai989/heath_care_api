import {EntityManager, EntityRepository, Repository} from "typeorm";
import {Service} from "typedi";
import {ResPartner} from "../models/ResPartner";
import {InjectManager} from "typeorm-typedi-extensions";

@Service()
@EntityRepository(ResPartner)
export class ResPartnerRepository extends Repository<ResPartner> {

    constructor(@InjectManager() private entityManager: EntityManager) {
        super();
    }

    async getCaloPartnerToday(dayOfWeek: string, partnerId: number, date: string, fromDate: string, toDate: string): Promise<any> {
        const caloIn = await this.entityManager.query(
            `select SUM(food.calo) as calo_in from (
            select lfmp.food_id, lf.calo from lw_food_menu_partner lfmp 
                inner join lw_food_menu_partner_today lfmpt on lfmpt.lw_food_menu_partner_id = lfmp.id 
                inner join lw_food lf on lfmp.food_id = lf.id 
                where lfmp.partner_id = $1 
                and lfmp.day_of_week = $2 
                and lfmp.menu_code in ('breakfast', 'lunch', 'dinner')
            ) as food`, [partnerId, dayOfWeek]);
        const caloOut = await this.entityManager.query(
            `select SUM(exercise.calo) as calo_out from (
            select lv.calo from lw_exercise_video_partner levp
                inner join lw_exercise_video lev on lev.id = levp.exercise_video_id
                inner join lw_video lv on lv.id = lev.video_id
                where levp.finish_flag = true
                and levp.partner_id = $1
                and levp.finish_date = $2
            ) as exercise`, [partnerId, date]);

        const caloInWeek = await this.entityManager.query(
            `select calo_day as calo_out from (
                       select SUM(lv.calo) as calo_day, levp.finish_date from lw_exercise_video_partner levp
                       inner join lw_exercise_video lev on lev.id = levp.exercise_video_id
                       inner join lw_video lv on lv.id = lev.video_id
                       where levp.finish_flag = true 
                       and levp.finish_date between '${fromDate}' and '${toDate}' 
                       and levp.partner_id = $1 group by levp.finish_date
                   ) as exercise`, [partnerId]);
        return {
            calo_in: caloIn ? caloIn[0].calo_in : 0,
            calo_out: caloOut ? caloOut[0].calo_out : 0,
            calo_total_week: caloInWeek
        };
    }
}
