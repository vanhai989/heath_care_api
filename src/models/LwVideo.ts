import {Column, Entity, Index, OneToMany, PrimaryGeneratedColumn,} from "typeorm";
import {LwVideoCategory} from "./LwVideoCategory";
import {LwExerciseVideo} from "./LwExerciseVideo";

@Index("lw_video_pkey", ["id"], {unique: true})
@Entity("lw_video", {schema: "public"})
export class LwVideo {
    @PrimaryGeneratedColumn({type: "integer", name: "id"})
    id: number;

    @Column("character varying", {name: "video_name"})
    videoName: string;

    @Column("character varying", {name: "image", nullable: true})
    image: string | null;

    @Column("character varying", {name: "url", nullable: true})
    url: string | null;

    @Column("double precision", {name: "calo", precision: 53})
    calo: number;

    @Column("text", {name: "description"})
    description: string;

    @Column("integer", {name: "create_uid", nullable: true})
    createUid: number | null;

    @Column("timestamp without time zone", {
        name: "create_date",
        nullable: true,
    })
    createDate: Date | null;

    @Column("integer", {name: "write_uid", nullable: true})
    writeUid: number | null;

    @Column("timestamp without time zone", {name: "write_date", nullable: true})
    writeDate: Date | null;

    @OneToMany(() => LwVideoCategory, (lwVideoCategory) => lwVideoCategory.video)
    lwVideoCategories: LwVideoCategory[];

    @OneToMany(
        () => LwExerciseVideo,
        (lwExerciseVideo) => lwExerciseVideo.exercise
    )
    lwExerciseVideos: LwExerciseVideo[];
}
