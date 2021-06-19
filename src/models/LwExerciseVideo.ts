import {Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {LwExercise} from "./LwExercise";
import {LwVideo} from "./LwVideo";

@Index("lw_exercise_video_pkey", ["id"], {unique: true})
@Entity("lw_exercise_video", {schema: "public"})
export class LwExerciseVideo {
    @PrimaryGeneratedColumn({type: "integer", name: "id"})
    id: number;

    @ManyToOne(() => LwExercise, (lwExercise) => lwExercise.lwExerciseVideos, {
        onDelete: "SET NULL",
    })
    @JoinColumn([{name: "exercise_id", referencedColumnName: "id"}])
    exercise: LwExercise;

    @ManyToOne(() => LwVideo, (lwVideo) => lwVideo.lwExerciseVideos, {
        onDelete: "SET NULL",
    })
    @JoinColumn([{name: "video_id", referencedColumnName: "id"}])
    video: LwVideo;
}
