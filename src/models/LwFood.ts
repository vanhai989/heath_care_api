import {Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn,} from "typeorm";
import {ResUsers} from "./ResUsers";

@Index("lw_food_pkey", ["id"], {unique: true})
@Entity("lw_food", {schema: "public"})
export class LwFood {
    @PrimaryGeneratedColumn({type: "integer", name: "id"})
    id: number;

    @Column("character varying", {name: "name"})
    name: string;

    @Column("double precision", {name: "calo", precision: 53})
    calo: number;

    @Column("text", {name: "description", nullable: true})
    description: string | null;

    @Column("integer", {name: "total_like"})
    totalLike: number;

    @Column("character varying", {name: "recommend_level", nullable: true})
    recommendLevel: string | null;

    @Column("double precision", {name: "prepare_time", precision: 53})
    prepareTime: number;

    @Column("double precision", {name: "cooking_time", precision: 53})
    cookingTime: number;

    @Column("timestamp without time zone", {
        name: "create_date",
        nullable: true,
    })
    createDate: Date | null;

    @Column("timestamp without time zone", {name: "write_date", nullable: true})
    writeDate: Date | null;

    @Column("character varying", {name: "image", nullable: true})
    image: string | null;

    @ManyToOne(() => ResUsers, (resUsers) => resUsers.lwFoods, {
        onDelete: "SET NULL",
    })
    @JoinColumn([{name: "create_uid", referencedColumnName: "id"}])
    createU: ResUsers;

    @ManyToOne(() => ResUsers, (resUsers) => resUsers.lwFoods2, {
        onDelete: "SET NULL",
    })
    @JoinColumn([{name: "write_uid", referencedColumnName: "id"}])
    writeU: ResUsers;
}
