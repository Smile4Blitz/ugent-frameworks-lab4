import 'reflect-metadata';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany } from "typeorm";
import { Chat } from './Chat';
import { User } from './User';

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    messageId!: number;

    @ManyToOne(() => Chat, chat => chat.messages, { onDelete: 'CASCADE' })
    chat!: Chat;

    @ManyToOne(() => User, user => user.userId, { onDelete: 'NO ACTION' })
    sender!: User;

    @Column()
    timestamp!: Date;

    @Column()
    content!: string;
}

