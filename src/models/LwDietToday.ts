import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity("lw_food_menu_partner_today", {schema: "public"})
export class LwDietToday {
    @PrimaryGeneratedColumn({type: "integer", name: "id"})
    id: number;

    @Column("bigint", {name: "lw_food_menu_partner_id", nullable: true})
    foodMenuPartnerId: string | null;

    @Column("boolean", {name: "status", nullable: true})
    status: boolean | null;

    @Column("date", {name: "created_date", nullable: true})
    createdDate: string | null;
}
