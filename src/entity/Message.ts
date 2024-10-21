import 'reflect-metadata';
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    chatId!: number;

    @Column()
    sender!: string;

    @Column()
    receiver!: string;

    @Column()
    timestamp!: Date;

    @Column()
    content!: string;
}
