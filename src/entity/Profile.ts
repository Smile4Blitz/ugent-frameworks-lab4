import 'reflect-metadata';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { User } from './User';

@Entity()
export class Profile {
    @PrimaryGeneratedColumn()
    profileId!: number;

    @Column()
    profileImageURL!: string;

    @OneToOne(() => User, user => user.profile, { lazy: true })
    @JoinColumn()
    user!: User;
}
