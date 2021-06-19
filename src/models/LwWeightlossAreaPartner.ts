import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn,} from "typeorm";
import {ResUsers} from "./ResUsers";
import {ResPartner} from "./ResPartner";
import {LwWeightlossArea} from "./LwWeightlossArea";

@Entity("lw_weightloss_area_partner", {schema: "public"})
export class LwWeightlossAreaPartner {
    @PrimaryGeneratedColumn({type: "integer", name: "id"})
    id: number;

    @Column("boolean", {name: "active"})
    active: boolean;

    @Column("timestamp without time zone", {
        name: "create_date",
        nullable: true,
    })
    createDate: Date | null;

    @Column("timestamp without time zone", {name: "write_date", nullable: true})
    writeDate: Date | null;

    @ManyToOne(() => ResUsers, (resUsers) => resUsers.lwWeightlossAreaPartners, {
        onDelete: "SET NULL",
    })
    @JoinColumn([{name: "create_uid", referencedColumnName: "id"}])
    createU: ResUsers;

    @ManyToOne(
        () => ResPartner,
        (resPartner) => resPartner.lwWeightlossAreaPartners,
        {onDelete: "CASCADE"}
    )
    @JoinColumn([{name: "partner_id", referencedColumnName: "id"}])
    partner: ResPartner;

    @ManyToOne(
        () => LwWeightlossArea,
        (lwWeightlossArea) => lwWeightlossArea.lwWeightlossAreaPartners,
        {onDelete: "CASCADE"}
    )
    @JoinColumn([{name: "weightloss_area_id", referencedColumnName: "id"}])
    weightlossArea: LwWeightlossArea;

    @ManyToOne(() => ResUsers, (resUsers) => resUsers.lwWeightlossAreaPartners2, {
        onDelete: "SET NULL",
    })
    @JoinColumn([{name: "write_uid", referencedColumnName: "id"}])
    writeU: ResUsers;
}
