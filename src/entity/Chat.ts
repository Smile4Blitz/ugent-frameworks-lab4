import 'reflect-metadata';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany, JoinTable, ManyToOne } from "typeorm";
import { Message } from './Message';
import { User } from "./User";

@Entity()
export class Chat {
    @PrimaryGeneratedColumn()
    chatId!: number;

    @Column()
    name!: string;

    @ManyToMany(() => User, { lazy: true })
    @JoinTable()
    participants!: User[];

    @OneToMany(() => Message, message => message.chat)
    messages!: Message[];
}
