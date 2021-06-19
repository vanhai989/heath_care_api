import {Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn,} from "typeorm";
import {LwExercise} from "./LwExercise";
import {LwWeightlossArea} from "./LwWeightlossArea";

@Index("lw_exercise_lw_weightloss_area_rel_pkey", ["id"], {unique: true})
@Index(
    "lw_exercise_lw_weightloss_area_rel_lw_exercise_id_idx",
    ["lwExerciseId"],
    {}
)
@Index(
    "lw_exercise_lw_weightloss_are_lw_exercise_id_lw_weightloss__key",
    ["lwExerciseId", "lwWeightlossAreaId"],
    {unique: true}
)
@Index(
    "lw_exercise_lw_weightloss_area_rel_lw_weightloss_area_id_idx",
    ["lwWeightlossAreaId"],
    {}
)
@Entity("lw_exercise_lw_weightloss_area_rel", {schema: "public"})
export class LwExerciseLwWeightlossAreaRel {
    @PrimaryGeneratedColumn({type: "integer", name: "id"})
    id: number;

    @Column("integer", {name: "lw_exercise_id", unique: true})
    lwExerciseId: number;

    @Column("integer", {name: "lw_weightloss_area_id", unique: true})
    lwWeightlossAreaId: number;

    @ManyToOne(
        () => LwExercise,
        (lwExercise) => lwExercise.lwExerciseLwWeightlossAreaRels,
        {onDelete: "CASCADE"}
    )
    @JoinColumn([{name: "lw_exercise_id", referencedColumnName: "id"}])
    lwExercise: LwExercise;

    @ManyToOne(
        () => LwWeightlossArea,
        (lwWeightlossArea) => lwWeightlossArea.lwExerciseLwWeightlossAreaRels,
        {onDelete: "CASCADE"}
    )
    @JoinColumn([{name: "lw_weightloss_area_id", referencedColumnName: "id"}])
    lwWeightlossArea: LwWeightlossArea;
}
