
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    JoinColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import WilayahEntity from "./wilayah.entity";
import Wilayah from "./wilayah.entity";


@Entity("kecamatan")
export default class KecamatanEntity {
    @PrimaryGeneratedColumn({ type: "bigint", unsigned: true })
    id: number;

    @Column({
        name: "nama",
        nullable: false,
    })
    nama: string;

    @ManyToOne(() => Wilayah,
        (ChartOfAccount) => ChartOfAccount.id)
    @JoinColumn({ name: "wilayah_id" })
    wilayah: Wilayah ;

}