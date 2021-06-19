import {EntityManager, EntityRepository, Repository} from "typeorm";
import {Service} from "typedi";
import {InjectManager} from "typeorm-typedi-extensions";
import {LwFoodMenuPartner} from "../models/LwFoodMenuPartner";

@Service()
@EntityRepository(LwFoodMenuPartner)
export class LwFoodMenuPartnerRepository extends Repository<LwFoodMenuPartner> {

    constructor(@InjectManager() private entityManager: EntityManager) {
        super();
    }

    public async countByPartnerAndMenu(menu_code: string, day_of_week: string, user_id: number): Promise<any> {
        const count = await this.entityManager.query(`SELECT COUNT(1) FROM lw_food_menu_partner 
        WHERE partner_id = ${user_id} AND menu_code = '${menu_code}' AND day_of_week = '${day_of_week}'`);
    }
}
