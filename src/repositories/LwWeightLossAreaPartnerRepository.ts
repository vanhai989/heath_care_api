import {EntityManager, EntityRepository, Repository} from "typeorm";
import {Service} from "typedi";
import {InjectManager} from "typeorm-typedi-extensions";
import {LwWeightlossAreaPartner} from "../models/LwWeightlossAreaPartner";

@Service()
@EntityRepository(LwWeightlossAreaPartner)
export class LwWeightLossAreaPartnerRepository extends Repository<LwWeightlossAreaPartner> {
    constructor(@InjectManager() private entityManager: EntityManager) {
        super();
    }

    bulkInsert(data: Partial<LwWeightlossAreaPartner>[]) {
        return this.createQueryBuilder()
            .insert()
            .into(LwWeightlossAreaPartner)
            .values(data)
            .execute();
    };

    async getByPartnerId(partnerId: number): Promise<any[]> {
        const muscles = await this.entityManager.query(
            `SELECT lwa.name FROM lw_weightloss_area_partner lwap
            INNER JOIN lw_weightloss_area lwa ON lwa.id = lwap.weightloss_area_id 
            WHERE lwap.partner_id = $1`, [partnerId]
        );
        return muscles;
    };
}
