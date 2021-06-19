import {Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn,} from "typeorm";
import {LwAccessToken} from "./LwAccessToken";
import {LwCaloHistory} from "./LwCaloHistory";
import {LwDiet} from "./LwDiet";
import {LwExercisePartner} from "./LwExercisePartner";
import {LwFcmToken} from "./LwFcmToken";
import {LwNewsTrace} from "./LwNewsTrace";
import {LwWeightlossAreaPartner} from "./LwWeightlossAreaPartner";
import {ResCompany} from "./ResCompany";
import {ResUsers} from "./ResUsers";

@Index("res_partner_commercial_partner_id_index", ["commercialPartnerId"], {})
@Index("res_partner_company_id_index", ["companyId"], {})
@Index("res_partner_date_index", ["date"], {})
@Index("res_partner_display_name_index", ["displayName"], {})
@Index("res_partner_pkey", ["id"], {unique: true})
@Index(
    "res_partner_message_main_attachment_id_index",
    ["messageMainAttachmentId"],
    {}
)
@Index("res_partner_name_index", ["name"], {})
@Index("res_partner_parent_id_index", ["parentId"], {})
@Index("res_partner_ref_index", ["ref"], {})
@Entity("res_partner", {schema: "public"})
export class ResPartner {
    @PrimaryGeneratedColumn({type: "integer", name: "id"})
    id: number;

    @Column("character varying", {name: "name", nullable: true})
    name: string | null;

    @Column("integer", {name: "company_id", nullable: true})
    companyId: number | null;

    @Column("timestamp without time zone", {
        name: "create_date",
        nullable: true,
    })
    createDate: Date | null;

    @Column("character varying", {name: "display_name", nullable: true})
    displayName: string | null;

    @Column("date", {name: "date", nullable: true})
    date: string | null;

    @Column("integer", {name: "title", nullable: true})
    title: number | null;

    @Column("integer", {name: "parent_id", nullable: true})
    parentId: number | null;

    @Column("character varying", {name: "ref", nullable: true})
    ref: string | null;

    @Column("character varying", {name: "lang", nullable: true})
    lang: string | null;

    @Column("character varying", {name: "tz", nullable: true})
    tz: string | null;

    @Column("character varying", {name: "vat", nullable: true})
    vat: string | null;

    @Column("character varying", {name: "website", nullable: true})
    website: string | null;

    @Column("text", {name: "comment", nullable: true})
    comment: string | null;

    @Column("double precision", {
        name: "credit_limit",
        nullable: true,
        precision: 53,
    })
    creditLimit: number | null;

    @Column("character varying", {name: "barcode", nullable: true})
    barcode: string | null;

    @Column("boolean", {name: "active", nullable: true})
    active: boolean | null;

    @Column("boolean", {name: "customer", nullable: true})
    customer: boolean | null;

    @Column("boolean", {name: "supplier", nullable: true})
    supplier: boolean | null;

    @Column("boolean", {name: "employee", nullable: true})
    employee: boolean | null;

    @Column("character varying", {name: "function", nullable: true})
    function: string | null;

    @Column("character varying", {name: "type", nullable: true})
    type: string | null;

    @Column("character varying", {name: "street", nullable: true})
    street: string | null;

    @Column("character varying", {name: "street2", nullable: true})
    street2: string | null;

    @Column("character varying", {name: "zip", nullable: true})
    zip: string | null;

    @Column("character varying", {name: "city", nullable: true})
    city: string | null;

    @Column("integer", {name: "state_id", nullable: true})
    stateId: number | null;

    @Column("integer", {name: "country_id", nullable: true})
    countryId: number | null;

    @Column("character varying", {name: "email", nullable: true})
    email: string | null;

    @Column("character varying", {name: "facebook_user_id", nullable: true})
    facebookUserId: string | null;

    @Column("character varying", {name: "phone", nullable: true})
    phone: string | null;

    @Column("character varying", {name: "mobile", nullable: true})
    mobile: string | null;

    @Column("boolean", {name: "is_company", nullable: true})
    isCompany: boolean | null;

    @Column("integer", {name: "industry_id", nullable: true})
    industryId: number | null;

    @Column("integer", {name: "color", nullable: true})
    color: number | null;

    @Column("boolean", {name: "partner_share", nullable: true})
    partnerShare: boolean | null;

    @Column("integer", {name: "commercial_partner_id", nullable: true})
    commercialPartnerId: number | null;

    @Column("character varying", {
        name: "commercial_company_name",
        nullable: true,
    })
    commercialCompanyName: string | null;

    @Column("character varying", {name: "company_name", nullable: true})
    companyName: string | null;

    @Column("timestamp without time zone", {name: "write_date", nullable: true})
    writeDate: Date | null;

    @Column("integer", {name: "message_main_attachment_id", nullable: true})
    messageMainAttachmentId: number | null;

    @Column("integer", {name: "message_bounce", nullable: true})
    messageBounce: number | null;

    @Column("character varying", {name: "signup_token", nullable: true})
    signupToken: string | null;

    @Column("character varying", {name: "signup_type", nullable: true})
    signupType: string | null;

    @Column("timestamp without time zone", {
        name: "signup_expiration",
        nullable: true,
    })
    signupExpiration: Date | null;

    @Column("character varying", {name: "ocn_token", nullable: true})
    ocnToken: string | null;

    @Column("integer", {name: "partner_gid", nullable: true})
    partnerGid: number | null;

    @Column("character varying", {name: "additional_info", nullable: true})
    additionalInfo: string | null;

    @Column("character varying", {name: "x_lw_password", nullable: true})
    xLwPassword: string | null;

    @Column("double precision", {
        name: "x_lw_height",
        nullable: true,
        precision: 53,
    })
    xLwHeight: number | null;

    @Column("double precision", {
        name: "x_lw_weight",
        nullable: true,
        precision: 53,
    })
    xLwWeight: number | null;

    @Column("timestamp without time zone", {name: "x_lw_dob", nullable: true})
    xLwDob: Date | null;

    @Column("character varying", {name: "x_lw_gender"})
    xLwGender: string;

    @Column("double precision", {
        name: "x_lw_expected_weight",
        nullable: true,
        precision: 53,
    })
    xLwExpectedWeight: number | null;

    @Column("double precision", {
        name: "x_lw_steps_per_day",
        nullable: true,
        precision: 53,
    })
    xLwStepsPerDay: number | null;

    @Column("double precision", {
        name: "x_lw_meals_per_day",
        nullable: true,
        precision: 53,
    })
    xLwMealsPerDay: number | null;

    @Column("character varying", {name: "x_lw_power", nullable: true})
    xLwPower: string | null;

    @Column("character varying", {name: "avatar", nullable: true})
    avatar: string | null;

    @Column("character varying", {name: "physical", nullable: true})
    physical: string | null;

    @Column("character varying", {name: "address", nullable: true})
    address: string | null;

    @OneToMany(() => LwAccessToken, (lwAccessToken) => lwAccessToken.partner)
    lwAccessTokens: LwAccessToken[];

    @OneToMany(() => LwCaloHistory, (lwCaloHistory) => lwCaloHistory.partner)
    lwCaloHistories: LwCaloHistory[];

    @OneToMany(() => LwDiet, (lwDiet) => lwDiet.partner)
    lwDiets: LwDiet[];

    @OneToMany(
        () => LwExercisePartner,
        (lwExercisePartner) => lwExercisePartner.partner
    )
    lwExercisePartners: LwExercisePartner[];

    @OneToMany(() => LwFcmToken, (lwFcmToken) => lwFcmToken.partner)
    lwFcmTokens: LwFcmToken[];

    @OneToMany(() => LwNewsTrace, (lwNewsTrace) => lwNewsTrace.partner)
    lwNewsTraces: LwNewsTrace[];

    @OneToMany(
        () => LwWeightlossAreaPartner,
        (lwWeightlossAreaPartner) => lwWeightlossAreaPartner.partner
    )
    lwWeightlossAreaPartners: LwWeightlossAreaPartner[];

    @ManyToOne(() => ResPartner, (resPartner) => resPartner.resPartners, {
        onDelete: "SET NULL",
    })
    @JoinColumn([{name: "commercial_partner_id", referencedColumnName: "id"}])
    commercialPartner: ResPartner;

    @OneToMany(() => ResPartner, (resPartner) => resPartner.commercialPartner)
    resPartners: ResPartner[];

    @ManyToOne(() => ResCompany, (resCompany) => resCompany.resPartners, {
        onDelete: "SET NULL",
    })
    @JoinColumn([{name: "company_id", referencedColumnName: "id"}])
    company: ResCompany;

    @ManyToOne(() => ResUsers, (resUsers) => resUsers.resPartners, {
        onDelete: "SET NULL",
    })
    @JoinColumn([{name: "create_uid", referencedColumnName: "id"}])
    createU: ResUsers;

    @ManyToOne(() => ResPartner, (resPartner) => resPartner.resPartners2, {
        onDelete: "SET NULL",
    })
    @JoinColumn([{name: "parent_id", referencedColumnName: "id"}])
    parent: ResPartner;

    @OneToMany(() => ResPartner, (resPartner) => resPartner.parent)
    resPartners2: ResPartner[];

    @ManyToOne(() => ResUsers, (resUsers) => resUsers.resPartners2, {
        onDelete: "SET NULL",
    })
    @JoinColumn([{name: "user_id", referencedColumnName: "id"}])
    user: ResUsers;

    @ManyToOne(() => ResUsers, (resUsers) => resUsers.resPartners3, {
        onDelete: "SET NULL",
    })
    @JoinColumn([{name: "write_uid", referencedColumnName: "id"}])
    writeU: ResUsers;

    @OneToMany(() => ResUsers, (resUsers) => resUsers.partner)
    resUsers: ResUsers[];
}
