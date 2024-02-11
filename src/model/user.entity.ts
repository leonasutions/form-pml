
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

@Entity("user_app_iccs")
export default class userEntity {
    @PrimaryGeneratedColumn({ type: "bigint", unsigned: true })
   
    id: number;
    @Column({
        name: "nrp",
        nullable: false,
    })
    nrp: string;

    @Column({
        name: "password",
        nullable: false,
    })
    password: string;

    @Column({
        name: "secret",
    })
    secret: string;

    @Column({
        name: "phone",
    })
    phone: string;
  }