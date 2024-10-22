import 'reflect-metadata';
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    userId!: number;

    @Column()
    name!: string;
}
