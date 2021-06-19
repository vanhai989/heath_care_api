import {Column, Entity, Index, OneToMany, PrimaryGeneratedColumn,} from "typeorm";
import {ResPartner} from "./ResPartner";
import {ResUsers} from "./ResUsers";

@Index("res_company_pkey", ["id"], {unique: true})
@Index("res_company_name_uniq", ["name"], {unique: true})
@Index("res_company_parent_id_index", ["parentId"], {})
@Entity("res_company", {schema: "public"})
export class ResCompany {
    @PrimaryGeneratedColumn({type: "integer", name: "id"})
    id: number;

    @Column("character varying", {name: "name", unique: true})
    name: string;

    @Column("integer", {name: "partner_id"})
    partnerId: number;

    @Column("integer", {name: "currency_id"})
    currencyId: number;

    @Column("integer", {name: "sequence", nullable: true})
    sequence: number | null;

    @Column("timestamp without time zone", {
        name: "create_date",
        nullable: true,
    })
    createDate: Date | null;

    @Column("integer", {name: "parent_id", nullable: true})
    parentId: number | null;

    @Column("text", {name: "report_header", nullable: true})
    reportHeader: string | null;

    @Column("text", {name: "report_footer", nullable: true})
    reportFooter: string | null;

    @Column("bytea", {name: "logo_web", nullable: true})
    logoWeb: Buffer | null;

    @Column("character varying", {name: "account_no", nullable: true})
    accountNo: string | null;

    @Column("character varying", {name: "email", nullable: true})
    email: string | null;

    @Column("character varying", {name: "phone", nullable: true})
    phone: string | null;

    @Column("character varying", {name: "company_registry", nullable: true})
    companyRegistry: string | null;

    @Column("integer", {name: "paperformat_id", nullable: true})
    paperformatId: number | null;

    @Column("integer", {name: "external_report_layout_id", nullable: true})
    externalReportLayoutId: number | null;

    @Column("character varying", {
        name: "base_onboarding_company_state",
        nullable: true,
    })
    baseOnboardingCompanyState: string | null;

    @Column("integer", {name: "create_uid", nullable: true})
    createUid: number | null;

    @Column("integer", {name: "write_uid", nullable: true})
    writeUid: number | null;

    @Column("timestamp without time zone", {name: "write_date", nullable: true})
    writeDate: Date | null;

    @Column("integer", {name: "partner_gid", nullable: true})
    partnerGid: number | null;

    @Column("boolean", {name: "snailmail_color", nullable: true})
    snailmailColor: boolean | null;

    @Column("boolean", {name: "snailmail_duplex", nullable: true})
    snailmailDuplex: boolean | null;

    @Column("integer", {name: "resource_calendar_id", nullable: true})
    resourceCalendarId: number | null;

    @OneToMany(() => ResPartner, (resPartner) => resPartner.company)
    resPartners: ResPartner[];

    @OneToMany(() => ResUsers, (resUsers) => resUsers.company)
    resUsers: ResUsers[];
}
