
import {
    Column,
    Entity,
    ManyToOne,
    JoinColumn,
    PrimaryGeneratedColumn,
} from "typeorm";
import tpsEntity from "./tps.entity";
import userEntity from "./user.entity";


@Entity("data_capres")
export default class DataCapresEntity {
    @PrimaryGeneratedColumn({ type: "bigint", unsigned: true })
    id: number;

    @Column({
        name: "paslon_1",
        nullable: false,
    })
    paslon_1: number;

    @Column({
        name: "paslon_2",
        nullable: false,
    })
    paslon_2: number;

    @Column({
        name: "paslon_3",
        nullable: false,
    })
    paslon_3: number;

    @Column({
        name: "suara_sah",
        nullable: false,
    })
    suara_sah: number;

    @Column({
        name: "total_dpt",
        nullable: false,
    })
    total_dpt: number;

    @Column({
        name: "total_dpt_tambahan",
        nullable: false,
    })
    total_dpt_tambahan: number;

    @Column({
        name: "total_dpt_khusus",
        nullable: false,
    })
    total_dpt_khusus: number;

    @Column({
        name: "total_dpt_datang",
        nullable: false,
    })
    total_dpt_datang: number;

    @Column({
        name: "suara_tidak_sah",
        nullable: false,
    })
    suara_tidak_sah: number;

    @ManyToOne(() => tpsEntity,
        (tps) => tps.id)
    @JoinColumn({ name: "tps_id" })
    tps: tpsEntity;

    @ManyToOne(() => userEntity,
        (user) => user.id)
    @JoinColumn({ name: "user_id" })
    user_id: userEntity;

}