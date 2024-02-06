
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

@Entity("wilayah")
export default class Wilayah {
    @PrimaryGeneratedColumn({ type: "bigint", unsigned: true })
   
    id: number;
    @Column({
        name: "nama",
        nullable: false,
    })
    nama: string;
  }