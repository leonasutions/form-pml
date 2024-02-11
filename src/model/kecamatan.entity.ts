
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    JoinColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    OneToMany,
} from "typeorm";
import WilayahEntity from "./wilayah.entity";
import Wilayah from "./wilayah.entity";
import kelurahanEntity from "./kelurahan.entity";


@Entity("kecamatan")
export default class KecamatanEntity {
    @PrimaryGeneratedColumn({ type: "bigint", unsigned: true })
    id: number;

    @Column({
        name: "nama",
        nullable: false,
    })
    nama: string;

    @Column({
        name: "type",
    })
    type: string;

    @OneToMany(() => kelurahanEntity,
        (kelurahan) => kelurahan.kecamatan,)
    @JoinColumn()
    kelurahans: kelurahanEntity[];

    @ManyToOne(() => Wilayah,
        (wilayah) => wilayah.id)

    @JoinColumn({ name: "wilayah_id" })
    wilayah: Wilayah;

}