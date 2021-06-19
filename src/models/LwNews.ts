import {Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn,} from "typeorm";
import {ResUsers} from "./ResUsers";
import {LwNewsTrace} from "./LwNewsTrace";

@Index("lw_news_pkey", ["id"], {unique: true})
@Entity("lw_news", {schema: "public"})
export class LwNews {
    @PrimaryGeneratedColumn({type: "integer", name: "id"})
    id: number;

    @Column("character varying", {name: "title"})
    title: string;

    @Column("text", {name: "description", nullable: true})
    description: string | null;

    @Column("timestamp without time zone", {
        name: "create_date",
        nullable: true,
    })
    createDate: Date | null;

    @Column("timestamp without time zone", {name: "write_date", nullable: true})
    writeDate: Date | null;

    @Column("character varying", {name: "image_url_list", nullable: true})
    imageUrlList: string | null;

    @ManyToOne(() => ResUsers, (resUsers) => resUsers.lwNews, {
        onDelete: "SET NULL",
    })
    @JoinColumn([{name: "create_uid", referencedColumnName: "id"}])
    createU: ResUsers;

    @ManyToOne(() => ResUsers, (resUsers) => resUsers.lwNews2, {
        onDelete: "SET NULL",
    })
    @JoinColumn([{name: "write_uid", referencedColumnName: "id"}])
    writeU: ResUsers;

    @OneToMany(() => LwNewsTrace, (lwNewsTrace) => lwNewsTrace.news)
    lwNewsTraces: LwNewsTrace[];
}
