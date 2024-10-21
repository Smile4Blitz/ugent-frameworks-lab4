import 'reflect-metadata';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany, JoinTable } from "typeorm";
import { Message } from './Message';
import { User } from "./User";

@Entity()
export class Chat {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @ManyToMany(() => User)
    @JoinTable()
    participants!: User[];

    @OneToMany(() => Message, message => message.chatId)
    messages!: Message[];
}
