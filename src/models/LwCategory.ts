import {Column, Entity, Index, OneToMany, PrimaryGeneratedColumn,} from "typeorm";
import {LwVideoCategory} from "./LwVideoCategory";

@Index("lw_food_category_pkey", ["id"], {unique: true})
@Entity("lw_category", {schema: "public"})
export class LwCategory {
    @PrimaryGeneratedColumn({type: "integer", name: "id"})
    id: number;

    @Column("character varying", {name: "name"})
    name: string;

    @Column("character varying", {name: "code"})
    code: string;

    @Column("timestamp without time zone", {
        name: "create_date",
        nullable: true,
    })
    createDate: Date | null;

    @Column("timestamp without time zone", {name: "write_date", nullable: true})
    writeDate: Date | null;

    @OneToMany(
        () => LwVideoCategory,
        (lwVideoCategory) => lwVideoCategory.category
    )
    lwVideoCategories: LwVideoCategory[];
}
