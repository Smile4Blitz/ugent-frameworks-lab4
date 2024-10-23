import 'reflect-metadata';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from "typeorm";
import { Profile } from './Profile';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    userId!: number;

    @Column()
    name!: string;

    @OneToOne(() => Profile, profile => profile.user, { cascade: true })
    profile!: Profile;
}
