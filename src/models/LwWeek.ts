import {Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn,} from "typeorm";
import {LwDiet} from "./LwDiet";
import {ResUsers} from "./ResUsers";

@Index("lw_week_pkey", ["id"], {unique: true})
@Entity("lw_week", {schema: "public"})
export class LwWeek {
    @PrimaryGeneratedColumn({type: "integer", name: "id"})
    id: number;

    @Column("character varying", {name: "day_of_week", nullable: true})
    dayOfWeek: string | null;

    @Column("timestamp without time zone", {
        name: "create_date",
        nullable: true,
    })
    createDate: Date | null;

    @Column("timestamp without time zone", {name: "write_date", nullable: true})
    writeDate: Date | null;

    @OneToMany(() => LwDiet, (lwDiet) => lwDiet.lwWeek)
    lwDiets: LwDiet[];

    @ManyToOne(() => ResUsers, (resUsers) => resUsers.lwWeeks, {
        onDelete: "SET NULL",
    })
    @JoinColumn([{name: "create_uid", referencedColumnName: "id"}])
    createU: ResUsers;

    @ManyToOne(() => ResUsers, (resUsers) => resUsers.lwWeeks2, {
        onDelete: "SET NULL",
    })
    @JoinColumn([{name: "write_uid", referencedColumnName: "id"}])
    writeU: ResUsers;
}
