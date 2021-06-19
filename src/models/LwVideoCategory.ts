import {Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn,} from "typeorm";
import {LwCategory} from "./LwCategory";
import {LwVideo} from "./LwVideo";

@Index("lw_video_category_pkey", ["id"], {unique: true})
@Entity("lw_video_category", {schema: "public"})
export class LwVideoCategory {
    @PrimaryGeneratedColumn({type: "integer", name: "id"})
    id: number;

    @ManyToOne(() => LwCategory, (lwCategory) => lwCategory.lwVideoCategories, {
        onDelete: "SET NULL",
    })
    @JoinColumn([{name: "category_id", referencedColumnName: "id"}])
    category: LwCategory;

    @ManyToOne(() => LwVideo, (lwVideo) => lwVideo.lwVideoCategories, {
        onDelete: "SET NULL",
    })
    @JoinColumn([{name: "video_id", referencedColumnName: "id"}])
    video: LwVideo;
}
