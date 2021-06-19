import {Column, Entity, Index} from "typeorm";

@Index("lw_food_category_pkey1", ["categoryCode", "foodId"], {unique: true})
@Entity("lw_food_category", {schema: "public"})
export class LwFoodCategory {
    @Column("bigint", {primary: true, name: "food_id"})
    foodId: number;

    @Column("character varying", {primary: true, name: "category_code"})
    categoryCode: string;

    @Column("bigint", {name: "partner_id ", nullable: true})
    partnerId: number | null;
}
