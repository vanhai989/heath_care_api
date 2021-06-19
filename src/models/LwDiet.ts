import {Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn,} from "typeorm";
import {ResUsers} from "./ResUsers";
import {LwWeek} from "./LwWeek";
import {ResPartner} from "./ResPartner";

@Index("lw_diet_pkey", ["id"], {unique: true})
@Entity("lw_diet", {schema: "public"})
export class LwDiet {
    @PrimaryGeneratedColumn({type: "integer", name: "id"})
    id: number;

    @Column("integer", {name: "lw_menu_id"})
    lwMenuId: number;

    @Column("timestamp without time zone", {
        name: "create_date",
        nullable: true,
    })
    createDate: Date | null;

    @Column("timestamp without time zone", {name: "write_date", nullable: true})
    writeDate: Date | null;

    @ManyToOne(() => ResUsers, (resUsers) => resUsers.lwDiets, {
        onDelete: "SET NULL",
    })
    @JoinColumn([{name: "create_uid", referencedColumnName: "id"}])
    createU: ResUsers;

    @ManyToOne(() => LwWeek, (lwWeek) => lwWeek.lwDiets, {onDelete: "SET NULL"})
    @JoinColumn([{name: "lw_week_id", referencedColumnName: "id"}])
    lwWeek: LwWeek;

    @ManyToOne(() => ResPartner, (resPartner) => resPartner.lwDiets, {
        onDelete: "SET NULL",
    })
    @JoinColumn([{name: "partner_id", referencedColumnName: "id"}])
    partner: ResPartner;

    @ManyToOne(() => ResUsers, (resUsers) => resUsers.lwDiets2, {
        onDelete: "SET NULL",
    })
    @JoinColumn([{name: "write_uid", referencedColumnName: "id"}])
    writeU: ResUsers;
}
