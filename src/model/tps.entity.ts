
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
import kelurahanEntity from "./kelurahan.entity";


@Entity("tps")
export default class tpsEntity {
    @PrimaryGeneratedColumn({ type: "bigint", unsigned: true })
    id: number;

    @Column({
        name: "nama",
        nullable: false,
    })
    nama: string;

    @Column({
        name: "alamat",
        nullable: false,
    })
    alamat: string;

    @Column({
        name: "nomor",
        nullable: false,
    })
    nomor: number;

    @ManyToOne(() => kelurahanEntity,
        (kecamatan) => kecamatan.id)
    @JoinColumn({ name: "kelurahan_id" })
    kelurahan: kelurahanEntity ;

}