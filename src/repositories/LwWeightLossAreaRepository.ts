import {EntityManager, EntityRepository, In, Repository} from "typeorm";
import {Service} from "typedi";
import {InjectManager} from "typeorm-typedi-extensions";
import {LwWeightlossArea} from "../models/LwWeightlossArea";

@Service()
@EntityRepository(LwWeightlossArea)
export class LwWeightLossAreaRepository extends Repository<LwWeightlossArea> {
    constructor(@InjectManager() private entityManager: EntityManager) {
        super();
    }

    async getByName(data: string[]): Promise<LwWeightlossArea[]> {
        // return this.entityManager.createQueryBuilder(LwWeightLossArea, "lossArea")
        //     .where("lossArea.name IN (:...names)", {names: data})
        //     .orderBy("lossArea.createDate")
        //     .getMany();

        return await this.entityManager.getRepository(LwWeightlossArea)
            .find({
                where: {name: In(data)},
                order: {createDate: "ASC"},
            });
    };
}
