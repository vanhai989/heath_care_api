import {Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn,} from "typeorm";
import {ResUsers} from "./ResUsers";
import {LwNews} from "./LwNews";
import {ResPartner} from "./ResPartner";

@Index("lw_news_trace_pkey", ["id"], {unique: true})
@Entity("lw_news_trace", {schema: "public"})
export class LwNewsTrace {
    @PrimaryGeneratedColumn({type: "integer", name: "id"})
    id: number;

    @Column("boolean", {name: "read_flg"})
    readFlg: boolean;

    @Column("boolean", {name: "like_flg"})
    likeFlg: boolean;

    @Column("timestamp without time zone", {
        name: "create_date",
        nullable: true,
    })
    createDate: Date | null;

    @Column("timestamp without time zone", {name: "write_date", nullable: true})
    writeDate: Date | null;

    @ManyToOne(() => ResUsers, (resUsers) => resUsers.lwNewsTraces, {
        onDelete: "SET NULL",
    })
    @JoinColumn([{name: "create_uid", referencedColumnName: "id"}])
    createU: ResUsers;

    @ManyToOne(() => LwNews, (lwNews) => lwNews.lwNewsTraces, {
        onDelete: "SET NULL",
    })
    @JoinColumn([{name: "news_id", referencedColumnName: "id"}])
    news: number;

    @ManyToOne(() => ResPartner, (resPartner) => resPartner.lwNewsTraces, {
        onDelete: "SET NULL",
    })
    @JoinColumn([{name: "partner_id", referencedColumnName: "id"}])
    partner: number;

    @ManyToOne(() => ResUsers, (resUsers) => resUsers.lwNewsTraces2, {
        onDelete: "SET NULL",
    })
    @JoinColumn([{name: "write_uid", referencedColumnName: "id"}])
    writeU: ResUsers;
}
