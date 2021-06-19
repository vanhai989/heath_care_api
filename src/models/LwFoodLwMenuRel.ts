import {Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn,} from "typeorm";
import {LwMenu} from "./LwMenu";

@Index("lw_food_lw_menu_rel_pkey", ["id"], {unique: true})
@Index(
    "lw_food_lw_menu_rel_lw_menu_id_lw_food_id_key",
    ["lwFoodId", "lwMenuId"],
    {unique: true}
)
@Index("lw_food_lw_menu_rel_lw_food_id_idx", ["lwFoodId"], {})
@Index("lw_food_lw_menu_rel_lw_menu_id_idx", ["lwMenuId"], {})
@Entity("lw_food_lw_menu_rel", {schema: "public"})
export class LwFoodLwMenuRel {
    @PrimaryGeneratedColumn({type: "integer", name: "id"})
    id: number;

    @Column("integer", {name: "lw_menu_id", unique: true})
    lwMenuId: number;

    @Column("integer", {name: "lw_food_id", unique: true})
    lwFoodId: number;

    @ManyToOne(() => LwMenu, (lwMenu) => lwMenu.lwFoodLwMenuRels, {
        onDelete: "CASCADE",
    })
    @JoinColumn([{name: "lw_menu_id", referencedColumnName: "id"}])
    lwMenu: LwMenu;
}
