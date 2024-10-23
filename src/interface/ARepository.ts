import { DataSource } from "typeorm";
import { AppDataSource } from "../data/DataSource";

export abstract class ARepository {
    protected dataSource : DataSource;
    constructor() {
        this.dataSource = AppDataSource.getInstance();
    }
}