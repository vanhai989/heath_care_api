import {Column, Entity, Index, OneToMany, PrimaryGeneratedColumn,} from "typeorm";
import {LwFoodLwMenuRel} from "./LwFoodLwMenuRel";

@Index("lw_menu_pkey", ["id"], {unique: true})
@Entity("lw_menu", {schema: "public"})
export class LwMenu {
    @PrimaryGeneratedColumn({type: "integer", name: "id"})
    id: number;

    @Column("character varying", {name: "name"})
    name: string;

    @Column("double precision", {name: "total_kcal", precision: 53})
    totalKcal: number;

    @Column("timestamp without time zone", {
        name: "create_date",
        nullable: true,
    })
    createDate: Date | null;

    @Column("timestamp without time zone", {name: "write_date", nullable: true})
    writeDate: Date | null;

    @Column("character varying", {name: "code", nullable: true})
    code: string | null;

    @OneToMany(() => LwFoodLwMenuRel, (lwFoodLwMenuRel) => lwFoodLwMenuRel.lwMenu)
    lwFoodLwMenuRels: LwFoodLwMenuRel[];
}
