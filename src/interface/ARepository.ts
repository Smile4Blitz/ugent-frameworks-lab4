import { DataSource } from "typeorm";

export abstract class ARepository {
    protected dataSource : DataSource;
    constructor(dataSource : DataSource) {
        this.dataSource = dataSource;
    }
}