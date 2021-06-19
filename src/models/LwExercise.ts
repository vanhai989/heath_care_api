import {
    Column,
    Entity,
    Index,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import {ResUsers} from "./ResUsers";
import {LwExerciseLwWeightlossAreaRel} from "./LwExerciseLwWeightlossAreaRel";
import {LwExercisePartner} from "./LwExercisePartner";
import {LwExerciseVideo} from "./LwExerciseVideo";
import {LwVideo} from "./LwVideo";

@Index("lw_exercise_pkey", ["id"], {unique: true})
@Entity("lw_exercise", {schema: "public"})
export class LwExercise {
    @PrimaryGeneratedColumn({type: "integer", name: "id"})
    id: number;

    @Column("character varying", {name: "name"})
    name: string;

    @Column("integer", {name: "duration"})
    duration: number;

    @Column("text", {name: "description"})
    description: string;

    @Column("double precision", {name: "kcal", nullable: true, precision: 53})
    kcal: number | null;

    @Column("double precision", {
        name: "min_weight",
        nullable: true,
        precision: 53,
    })
    minWeight: number | null;

    @Column("double precision", {
        name: "max_weight",
        nullable: true,
        precision: 53,
    })
    maxWeight: number | null;

    @Column("double precision", {
        name: "min_height",
        nullable: true,
        precision: 53,
    })
    minHeight: number | null;

    @Column("double precision", {
        name: "max_height",
        nullable: true,
        precision: 53,
    })
    maxHeight: number | null;

    @Column("boolean", {name: "fixed"})
    fixed: boolean;

    @Column("timestamp without time zone", {
        name: "create_date",
        nullable: true,
    })
    createDate: Date | null;

    @Column("timestamp without time zone", {name: "write_date", nullable: true})
    writeDate: Date | null;

    @Column("character varying", {name: "image", nullable: true})
    image: string | null;

    @Column("character varying", {name: "video", nullable: true})
    video: string | null;

    @ManyToOne(() => ResUsers, (resUsers) => resUsers.lwExercises, {
        onDelete: "SET NULL",
    })
    @JoinColumn([{name: "create_uid", referencedColumnName: "id"}])
    createU: ResUsers;

    @ManyToOne(() => ResUsers, (resUsers) => resUsers.lwExercises2, {
        onDelete: "SET NULL",
    })
    @JoinColumn([{name: "write_uid", referencedColumnName: "id"}])
    writeU: ResUsers;

    @OneToMany(
        () => LwExerciseLwWeightlossAreaRel,
        (lwExerciseLwWeightlossAreaRel) => lwExerciseLwWeightlossAreaRel.lwExercise
    )
    lwExerciseLwWeightlossAreaRels: LwExerciseLwWeightlossAreaRel[];

    @OneToMany(
        () => LwExercisePartner,
        (lwExercisePartner) => lwExercisePartner.exercise
    )
    lwExercisePartners: LwExercisePartner[];

    @OneToMany(
        () => LwExerciseVideo,
        (lwExerciseVideo) => lwExerciseVideo.exercise,
        {eager: true}
    )
    lwExerciseVideos: LwExerciseVideo[];

    @ManyToMany(type => LwVideo)
    @JoinTable()
    lwVideos: LwVideo[];
}
