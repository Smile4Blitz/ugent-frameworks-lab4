import { DataSource } from "typeorm";
import { User } from "../entity/User";
import { Chat } from "../entity/Chat";
import { Message } from "../entity/Message";

export class AppDataSource {
    private static dataSource: DataSource;

    public static initialize(): void {
        if (!this.dataSource) {
            this.dataSource = new DataSource({
                type: "postgres",
                host: process.env.POSTGRES_HOST,
                port: Number(process.env.POSTGRES_PORT),
                username: process.env.POSTGRES_USER,
                password: process.env.POSTGRES_PASSWORD,
                database: process.env.POSTGRES_DB,
                entities: [User, Chat, Message],
                synchronize: false, // creates or updates tables, set to false if db already contains those tables
            });
        }

        if (!this.dataSource.isInitialized) {
            this.dataSource.initialize()
                .then(() => {
                    console.log("Database initialized successfully.");
                })
                .catch((error) => {
                    console.error("Couldn't initialize database: " + error);
                    throw error;
                });
        }
    }

    public static getInstance(): DataSource {
        if (!this.dataSource.isInitialized) {
            this.initialize();
        }
        return this.dataSource;
    }
}
