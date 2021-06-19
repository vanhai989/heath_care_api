import {Service} from "typedi";
import {BaseService} from "./BaseService";
import {LwNews} from "../models/LwNews";
import {OrmRepository} from "typeorm-typedi-extensions";
import {LwNewsRepository} from "../repositories/LwNewsRepository";
import {NewsErrors} from "../api/errors/NewsNotFoundError";
import {LwNewTraceRepository} from "../repositories/LwNewTraceRepository";

@Service()
export class LwNewService extends BaseService<LwNews> {
    constructor(@OrmRepository() private lwNewsRepository: LwNewsRepository,
                @OrmRepository() private lwNewTraceRepository: LwNewTraceRepository) {
        super(LwNews);
    }

    public async getNewsDetail(newsId: number, userId: number) {
        await this.view(newsId, userId);
        const response = await this.lwNewsRepository.getNewsDetail(newsId, userId);
        if (response) {
            return response[0];
        } else {
            throw new NewsErrors(404);
        }
    }

    public getNews(page: number, limit: number, userId: number) {
        return this.lwNewsRepository.getNews(page, limit, userId);
    }

    public like(newsId: number, likeFlag: boolean, userId: number) {
        return this.lwNewsRepository.like(newsId, likeFlag, userId);
    }

    public view(newsId: number, userId: number) {
        return this.lwNewTraceRepository.view(newsId, userId);
    }
}
