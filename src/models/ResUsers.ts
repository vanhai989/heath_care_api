import {Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn,} from "typeorm";
import {LwAccessToken} from "./LwAccessToken";
import {LwCaloHistory} from "./LwCaloHistory";
import {LwDiet} from "./LwDiet";
import {LwExPartnerWeek} from "./LwExPartnerWeek";
import {LwExercise} from "./LwExercise";
import {LwExercisePartner} from "./LwExercisePartner";
import {LwFcmToken} from "./LwFcmToken";
import {LwFood} from "./LwFood";
import {LwNews} from "./LwNews";
import {LwNewsTrace} from "./LwNewsTrace";
import {LwWeek} from "./LwWeek";
import {LwWeightlossArea} from "./LwWeightlossArea";
import {LwWeightlossAreaPartner} from "./LwWeightlossAreaPartner";
import {ResPartner} from "./ResPartner";
import {ResCompany} from "./ResCompany";

@Index("res_users_pkey", ["id"], {unique: true})
@Index("res_users_login_key", ["login"], {unique: true})
@Entity("res_users", {schema: "public"})
export class ResUsers {
    @PrimaryGeneratedColumn({type: "integer", name: "id"})
    id: number;

    @Column("boolean", {name: "active", nullable: true, default: () => "true"})
    active: boolean | null;

    @Column("character varying", {name: "login", unique: true})
    login: string;

    @Column("character varying", {name: "password", nullable: true})
    password: string | null;

    @Column("timestamp without time zone", {
        name: "create_date",
        nullable: true,
    })
    createDate: Date | null;

    @Column("text", {name: "signature", nullable: true})
    signature: string | null;

    @Column("integer", {name: "action_id", nullable: true})
    actionId: number | null;

    @Column("boolean", {name: "share", nullable: true})
    share: boolean | null;

    @Column("timestamp without time zone", {name: "write_date", nullable: true})
    writeDate: Date | null;

    @Column("integer", {name: "alias_id", nullable: true})
    aliasId: number | null;

    @Column("character varying", {name: "notification_type"})
    notificationType: string;

    @Column("character varying", {name: "odoobot_state"})
    odoobotState: string;

    @OneToMany(() => LwAccessToken, (lwAccessToken) => lwAccessToken.createU)
    lwAccessTokens: LwAccessToken[];

    @OneToMany(() => LwAccessToken, (lwAccessToken) => lwAccessToken.writeU)
    lwAccessTokens2: LwAccessToken[];

    @OneToMany(() => LwCaloHistory, (lwCaloHistory) => lwCaloHistory.createU)
    lwCaloHistories: LwCaloHistory[];

    @OneToMany(() => LwCaloHistory, (lwCaloHistory) => lwCaloHistory.writeU)
    lwCaloHistories2: LwCaloHistory[];

    @OneToMany(() => LwDiet, (lwDiet) => lwDiet.createU)
    lwDiets: LwDiet[];

    @OneToMany(() => LwDiet, (lwDiet) => lwDiet.writeU)
    lwDiets2: LwDiet[];

    @OneToMany(
        () => LwExPartnerWeek,
        (lwExPartnerWeek) => lwExPartnerWeek.createU
    )
    lwExPartnerWeeks: LwExPartnerWeek[];

    @OneToMany(() => LwExPartnerWeek, (lwExPartnerWeek) => lwExPartnerWeek.writeU)
    lwExPartnerWeeks2: LwExPartnerWeek[];

    @OneToMany(() => LwExercise, (lwExercise) => lwExercise.createU)
    lwExercises: LwExercise[];

    @OneToMany(() => LwExercise, (lwExercise) => lwExercise.writeU)
    lwExercises2: LwExercise[];

    @OneToMany(
        () => LwExercisePartner,
        (lwExercisePartner) => lwExercisePartner.createU
    )
    lwExercisePartners: LwExercisePartner[];

    @OneToMany(
        () => LwExercisePartner,
        (lwExercisePartner) => lwExercisePartner.writeU
    )
    lwExercisePartners2: LwExercisePartner[];

    @OneToMany(() => LwFcmToken, (lwFcmToken) => lwFcmToken.createU)
    lwFcmTokens: LwFcmToken[];

    @OneToMany(() => LwFcmToken, (lwFcmToken) => lwFcmToken.writeU)
    lwFcmTokens2: LwFcmToken[];

    @OneToMany(() => LwFood, (lwFood) => lwFood.createU)
    lwFoods: LwFood[];

    @OneToMany(() => LwFood, (lwFood) => lwFood.writeU)
    lwFoods2: LwFood[];

    @OneToMany(() => LwNews, (lwNews) => lwNews.createU)
    lwNews: LwNews[];

    @OneToMany(() => LwNews, (lwNews) => lwNews.writeU)
    lwNews2: LwNews[];

    @OneToMany(() => LwNewsTrace, (lwNewsTrace) => lwNewsTrace.createU)
    lwNewsTraces: LwNewsTrace[];

    @OneToMany(() => LwNewsTrace, (lwNewsTrace) => lwNewsTrace.writeU)
    lwNewsTraces2: LwNewsTrace[];

    @OneToMany(() => LwWeek, (lwWeek) => lwWeek.createU)
    lwWeeks: LwWeek[];

    @OneToMany(() => LwWeek, (lwWeek) => lwWeek.writeU)
    lwWeeks2: LwWeek[];

    @OneToMany(
        () => LwWeightlossArea,
        (lwWeightlossArea) => lwWeightlossArea.createU
    )
    lwWeightlossAreas: LwWeightlossArea[];

    @OneToMany(
        () => LwWeightlossArea,
        (lwWeightlossArea) => lwWeightlossArea.writeU
    )
    lwWeightlossAreas2: LwWeightlossArea[];

    @OneToMany(
        () => LwWeightlossAreaPartner,
        (lwWeightlossAreaPartner) => lwWeightlossAreaPartner.createU
    )
    lwWeightlossAreaPartners: LwWeightlossAreaPartner[];

    @OneToMany(
        () => LwWeightlossAreaPartner,
        (lwWeightlossAreaPartner) => lwWeightlossAreaPartner.writeU
    )
    lwWeightlossAreaPartners2: LwWeightlossAreaPartner[];

    @OneToMany(() => ResPartner, (resPartner) => resPartner.createU)
    resPartners: ResPartner[];

    @OneToMany(() => ResPartner, (resPartner) => resPartner.user)
    resPartners2: ResPartner[];

    @OneToMany(() => ResPartner, (resPartner) => resPartner.writeU)
    resPartners3: ResPartner[];

    @ManyToOne(() => ResCompany, (resCompany) => resCompany.resUsers, {
        onDelete: "SET NULL",
    })
    @JoinColumn([{name: "company_id", referencedColumnName: "id"}])
    company: ResCompany;

    @ManyToOne(() => ResUsers, (resUsers) => resUsers.resUsers, {
        onDelete: "SET NULL",
    })
    @JoinColumn([{name: "create_uid", referencedColumnName: "id"}])
    createU: ResUsers;

    @OneToMany(() => ResUsers, (resUsers) => resUsers.createU)
    resUsers: ResUsers[];

    @ManyToOne(() => ResPartner, (resPartner) => resPartner.resUsers, {
        onDelete: "RESTRICT",
    })
    @JoinColumn([{name: "partner_id", referencedColumnName: "id"}])
    partner: ResPartner;

    @ManyToOne(() => ResUsers, (resUsers) => resUsers.resUsers2, {
        onDelete: "SET NULL",
    })
    @JoinColumn([{name: "write_uid", referencedColumnName: "id"}])
    writeU: ResUsers;

    @OneToMany(() => ResUsers, (resUsers) => resUsers.writeU)
    resUsers2: ResUsers[];
}
