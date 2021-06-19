import {Service} from "typedi";
import {LwFood} from "../models/LwFood";
import {BaseService} from "./BaseService";
import {OrmRepository} from "typeorm-typedi-extensions";
import {LwFoodRepository} from "../repositories/LwFoodRepository";
import {LwFoodMenuPartnerRepository} from "../repositories/LwFoodMenuPartnerRepository";
import {FoodCreateRequest} from "../models/dto/FoodCreateRequest";
import {RatingRequest} from "../models/dto/RatingRequest";

@Service()
export class LwFoodService extends BaseService<LwFood> {
    constructor(@OrmRepository() private lwFoodRepository: LwFoodRepository,
                @OrmRepository() private lwFoodMenuPartnerRepository: LwFoodMenuPartnerRepository) {
        super(LwFood);
    }

    public search(name: string, category: string, page: number = 1, limit: number = 10, user_id: number):
        Promise<{ total: number; data: any; nextPage: boolean; limit: number; from: number; page: number; to: number }> {
        return this.lwFoodRepository.findByNameAndCategory(name, category, page, limit, user_id);
    }

    public async getById(id: number, partnerId: number): Promise<any> {
        return this.lwFoodRepository.getById(id, partnerId);
    }

    public async rating(rating: RatingRequest, resPartnerId: number): Promise<any> {
        return this.lwFoodRepository.rating(rating, resPartnerId);
    }

    public async like(foodId: number, resPartnerId: number, likeFlag: number) {
        return this.lwFoodRepository.like(foodId, resPartnerId, likeFlag);
    }

    public async changeFood(data: any, partnerId: number) {
        const foodCategoryArr: { foodId: number; menuCode: string; partnerId: number; dayOfWeek: string }[] = [];
        const foodIds = data.food_add_ids;
        const foodDeleteIds = data.food_delete_ids;
        if (Array.isArray(foodIds) && foodIds.length)
            foodIds.forEach((item: number) => {
                foodCategoryArr.push({
                    foodId: item,
                    menuCode: data.menu_code,
                    partnerId: data.partnerId,
                    dayOfWeek: data.dow
                });
            });
        return this.lwFoodRepository.changeFood(foodCategoryArr, foodDeleteIds, partnerId);
    }

    public async create(food: Partial<FoodCreateRequest>, image: string): Promise<LwFood> {
        const payload: Partial<LwFood> = {};
        if (food.name) {
            payload.name = food.name;
        }
        if (food.calo) {
            payload.calo = food.calo;
        }
        if (image) {
            payload.image = image;
        }
        if (food.description) {
            payload.description = food.description;
        }
        const now = new Date();
        payload.createDate = now;
        payload.writeDate = now;
        payload.totalLike = 0;
        payload.prepareTime = 0;
        payload.cookingTime = 0;
        return this.lwFoodRepository.save(payload);
    }

    public async getFoodByDate(date: string, menu: string, user_id: number, page: number = 1, limit: number = 10):
        Promise<any> {
        return this.lwFoodRepository.findFoodByDateCategory(date, menu, user_id, page, limit);
    }

    public getOtherFood(category: string, page: number = 1, limit: number = 10, user_id: number): Promise<any> {
        return this.lwFoodRepository.findFoodByCategory(category, page, limit, user_id);
    }

    public finishDiet(menuCode: string, dow: string, userId: number): Promise<any> {
        return this.lwFoodRepository.finishDiet(menuCode, dow, userId);
    }

}
