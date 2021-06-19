import {Service} from "typedi";
import {ResPartner} from "../models";
import {BaseService} from "./BaseService";
import {OrmRepository} from "typeorm-typedi-extensions";
import {ResPartnerRepository} from "../repositories/ResPartnerRepository";
import {UserCreateRequest} from "../models/dto/UserCreateRequest";
import argon2 from "argon2";
import logger from "../lib/logger/logger";
import {randomBytes} from "crypto";
import {UserExitsError} from "../api/errors/UserExitsError";
import {UserChangePasswordRequest} from "../models/dto/UserChangePasswordRequest";
import {WrongPasswordErrors} from "../api/errors/WrongPasswordErros";
import {StatusCodes} from "http-status-codes";
import {LwWeightLossAreaPartnerRepository} from "../repositories/LwWeightLossAreaPartnerRepository";
import {LwWeightlossAreaPartner} from "../models/LwWeightlossAreaPartner";
import {LwWeightLossAreaRepository} from "../repositories/LwWeightLossAreaRepository";
import {LwWeightlossArea} from "../models/LwWeightlossArea";
import {DateUtils} from "../utils/DateUtils";


@Service()
export class ResPartnerService extends BaseService<ResPartner> {
    constructor(@OrmRepository() private _resPartnerRepository: ResPartnerRepository,
                @OrmRepository() private _lwWeightLossAreaPartnerRepository: LwWeightLossAreaPartnerRepository,
                @OrmRepository() private _lwWeightLossAreaRepository: LwWeightLossAreaRepository) {
        super(ResPartner);
    }

    public async getAll(): Promise<ResPartner[] | undefined> {
        return this._resPartnerRepository.find();
    }

    public async getByPhone(phone: string): Promise<ResPartner[] | undefined> {
        return this._resPartnerRepository.find({phone});
    }

    public async getMuscle(partnerId: number): Promise<string[] | undefined> {
        const data = await this._lwWeightLossAreaPartnerRepository.getByPartnerId(partnerId);
        const muscle = [];
        for (const name in data) {
            const obj: { name: string } = data[name];
            if (obj) {
                muscle.push(obj.name);
            }
        }
        return muscle;
    }


    public async getByFacebookUserId(facebookUserId: string): Promise<ResPartner[] | undefined> {
        return this._resPartnerRepository.find({facebookUserId});
    }

    public async getByEmail(email: string): Promise<ResPartner[] | undefined> {
        return this._resPartnerRepository.find({email});
    }

    public async getCaloPartnerToday(fromDate: string, toDate: string, partnerId: number): Promise<ResPartner | undefined> {
        const now = new Date();
        const dayOfWeek = DateUtils.dow(now.toISOString());
        const date = DateUtils.dateToString(now, "YYYY-MM-DD");
        return this._resPartnerRepository.getCaloPartnerToday(dayOfWeek, partnerId, date, fromDate, toDate);
    }

    public async getById(id: number): Promise<ResPartner | undefined> {
        return this._resPartnerRepository.findOne({id});
    }

    public async changeInfoUser(userInfo: any, user: ResPartner, avatarLocation: string): Promise<ResPartner> {
        if (userInfo.name) {
            user.name = userInfo.name;
        }
        if (userInfo.email) {
            user.email = userInfo.email;
        }
        if (userInfo.address) {
            user.address = userInfo.address;
        }
        if (userInfo.gender) {
            user.xLwGender = userInfo.gender;
        }
        if (userInfo.target_weight) {
            user.xLwExpectedWeight = userInfo.target_weight;
        }
        if (userInfo.physical) {
            user.physical = userInfo.physical;
        }
        if (userInfo.height) {
            user.xLwHeight = userInfo.height;
        }
        if (userInfo.weight) {
            user.xLwWeight = userInfo.weight;
        }
        user.writeDate = new Date();
        return this._resPartnerRepository.save(user);
    }

    public async create(user: UserCreateRequest): Promise<any> {
        logger.info(user);
        const userValid = await this.getByPhone(user.phone);
        if (userValid && userValid.length > 0)
            throw new UserExitsError();

        const salt = randomBytes(32);
        const payload: Partial<ResPartner> = {};
        if (user.email) {
            payload.email = user.email;
        }
        if (user.name) {
            payload.name = user.name;
            payload.displayName = user.name;
        }
        if (user.password) {
            payload.xLwPassword = await argon2.hash(user.password, {salt});
        }
        if (user.dob) {
            payload.xLwDob = new Date(user.dob);
        }
        if (user.gender) {
            payload.xLwGender = user.gender;
        }
        if (user.phone) {
            payload.phone = user.phone;
        }
        if (user.address) {
            payload.address = user.address;
        }
        if (user.height) {
            payload.xLwWeight = user.height;
        }
        if (user.weight) {
            payload.xLwExpectedWeight = user.weight;
        }
        if (user.target_weight) {
            payload.xLwWeight = user.target_weight;
        }
        if (user.physical) {
            payload.physical = user.physical;
        }
        payload.createDate = new Date();
        payload.writeDate = new Date();

        const muscleData: Partial<LwWeightlossAreaPartner>[] = [];
        const lwWeightLossAreaPartner: Partial<LwWeightlossAreaPartner> = {};
        const now = new Date();
        const userDb = await this._resPartnerRepository.save(payload);

        const weightLossArea = await this._lwWeightLossAreaRepository.getByName(user.muscle);
        const resPartner = new ResPartner();
        resPartner.id = userDb.id;
        const lwWeightLossArea = new LwWeightlossArea();

        weightLossArea.forEach((item: LwWeightlossArea) => {
            lwWeightLossArea.id = item.id;
            lwWeightLossAreaPartner.partner = resPartner;
            lwWeightLossAreaPartner.weightlossArea = lwWeightLossArea;
            lwWeightLossAreaPartner.active = true;
            lwWeightLossAreaPartner.createDate = now;
            lwWeightLossAreaPartner.writeDate = now;
            muscleData.push(lwWeightLossAreaPartner);
        });
        if (muscleData && muscleData.length > 0) {
            await this._lwWeightLossAreaPartnerRepository.bulkInsert(muscleData);
        }
        return userDb;
    }

    public async changePassword(userInfo: UserChangePasswordRequest, user: ResPartner): Promise<ResPartner> {
        const {old_pass, new_pass} = userInfo;
        const oldPassVerify = await argon2.verify(user.xLwPassword, old_pass);

        if (!oldPassVerify) {
            throw new WrongPasswordErrors(StatusCodes.UNAUTHORIZED);
        }

        const salt = randomBytes(32);
        const password = await argon2.hash(new_pass, {salt});
        if (userInfo.new_pass) {
            user.xLwPassword = password;
        }
        user.writeDate = new Date();
        return this._resPartnerRepository.save(user);
    }
}
