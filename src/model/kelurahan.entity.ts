
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
import KecamatanEntity from "./kecamatan.entity";


@Entity("kelurahan")
export default class kelurahanEntity {
    @PrimaryGeneratedColumn({ type: "bigint", unsigned: true })
    id: number;

    @Column({
        name: "nama",
        nullable: false,
    })
    nama: string;

    @ManyToOne(() => KecamatanEntity,
        (kecamatan) => kecamatan.id)
    @JoinColumn({ name: "kecamatan_id" })
    kecamatan: KecamatanEntity ;

}