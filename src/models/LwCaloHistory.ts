import {Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn,} from "typeorm";
import {ResUsers} from "./ResUsers";
import {ResPartner} from "./ResPartner";

@Index("lw_calo_history_pkey", ["id"], {unique: true})
@Entity("lw_calo_history", {schema: "public"})
export class LwCaloHistory {
    @PrimaryGeneratedColumn({type: "integer", name: "id"})
    id: number;

    @Column("double precision", {
        name: "calo_input",
        nullable: true,
        precision: 53,
    })
    caloInput: number | null;

    @Column("double precision", {
        name: "calo_ouput",
        nullable: true,
        precision: 53,
    })
    caloOuput: number | null;

    @Column("timestamp without time zone", {
        name: "create_date",
        nullable: true,
    })
    createDate: Date | null;

    @Column("timestamp without time zone", {name: "write_date", nullable: true})
    writeDate: Date | null;

    @ManyToOne(() => ResUsers, (resUsers) => resUsers.lwCaloHistories, {
        onDelete: "SET NULL",
    })
    @JoinColumn([{name: "create_uid", referencedColumnName: "id"}])
    createU: ResUsers;

    @ManyToOne(() => ResPartner, (resPartner) => resPartner.lwCaloHistories, {
        onDelete: "CASCADE",
    })
    @JoinColumn([{name: "partner_id", referencedColumnName: "id"}])
    partner: ResPartner;

    @ManyToOne(() => ResUsers, (resUsers) => resUsers.lwCaloHistories2, {
        onDelete: "SET NULL",
    })
    @JoinColumn([{name: "write_uid", referencedColumnName: "id"}])
    writeU: ResUsers;
}
