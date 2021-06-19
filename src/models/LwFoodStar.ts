import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity({name: "lw_food_star"})
export class LwFoodStar {
    @PrimaryColumn()
    public foodId: number;

    @Column({name: "res_partner_id"})
    public resPartnerId: number;

    @Column({name: "star"})
    public star: number;

    @Column({name: "like_flag"})
    public likeFlag: number;
}
