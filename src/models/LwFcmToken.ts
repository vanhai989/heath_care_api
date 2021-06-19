import {Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn,} from "typeorm";
import {ResUsers} from "./ResUsers";
import {ResPartner} from "./ResPartner";

@Index("lw_fcm_token_pkey", ["id"], {unique: true})
@Entity("lw_fcm_token", {schema: "public"})
export class LwFcmToken {
    @PrimaryGeneratedColumn({type: "integer", name: "id"})
    id: number;

    @Column("character varying", {name: "token"})
    token: string;

    @Column("character varying", {name: "device_id"})
    deviceId: string;

    @Column("timestamp without time zone", {
        name: "create_date",
        nullable: true,
    })
    createDate: Date | null;

    @Column("timestamp without time zone", {name: "write_date", nullable: true})
    writeDate: Date | null;

    @ManyToOne(() => ResUsers, (resUsers) => resUsers.lwFcmTokens, {
        onDelete: "SET NULL",
    })
    @JoinColumn([{name: "create_uid", referencedColumnName: "id"}])
    createU: ResUsers;

    @ManyToOne(() => ResPartner, (resPartner) => resPartner.lwFcmTokens, {
        onDelete: "CASCADE",
    })
    @JoinColumn([{name: "partner_id", referencedColumnName: "id"}])
    partner: ResPartner;

    @ManyToOne(() => ResUsers, (resUsers) => resUsers.lwFcmTokens2, {
        onDelete: "SET NULL",
    })
    @JoinColumn([{name: "write_uid", referencedColumnName: "id"}])
    writeU: ResUsers;
}
