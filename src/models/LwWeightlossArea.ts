import {Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn,} from "typeorm";
import {LwExerciseLwWeightlossAreaRel} from "./LwExerciseLwWeightlossAreaRel";
import {ResUsers} from "./ResUsers";
import {LwWeightlossAreaPartner} from "./LwWeightlossAreaPartner";

@Index("lw_weightloss_area_pkey", ["id"], {unique: true})
@Entity("lw_weightloss_area", {schema: "public"})
export class LwWeightlossArea {
    @PrimaryGeneratedColumn({type: "integer", name: "id"})
    id: number;

    @Column("character varying", {name: "name"})
    name: string;

    @Column("timestamp without time zone", {
        name: "create_date",
        nullable: true,
    })
    createDate: Date | null;

    @Column("timestamp without time zone", {name: "write_date", nullable: true})
    writeDate: Date | null;

    @OneToMany(
        () => LwExerciseLwWeightlossAreaRel,
        (lwExerciseLwWeightlossAreaRel) =>
            lwExerciseLwWeightlossAreaRel.lwWeightlossArea
    )
    lwExerciseLwWeightlossAreaRels: LwExerciseLwWeightlossAreaRel[];

    @ManyToOne(() => ResUsers, (resUsers) => resUsers.lwWeightlossAreas, {
        onDelete: "SET NULL",
    })
    @JoinColumn([{name: "create_uid", referencedColumnName: "id"}])
    createU: ResUsers;

    @ManyToOne(() => ResUsers, (resUsers) => resUsers.lwWeightlossAreas2, {
        onDelete: "SET NULL",
    })
    @JoinColumn([{name: "write_uid", referencedColumnName: "id"}])
    writeU: ResUsers;

    @OneToMany(
        () => LwWeightlossAreaPartner,
        (lwWeightlossAreaPartner) => lwWeightlossAreaPartner.weightlossArea
    )
    lwWeightlossAreaPartners: LwWeightlossAreaPartner[];
}
