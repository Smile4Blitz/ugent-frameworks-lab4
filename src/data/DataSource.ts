import { DataSource } from "typeorm";
import { User } from "../entity/User";
import { Chat } from "../entity/Chat";
import { Message } from "../entity/Message";

export class AppDataSource {
    private static dataSource: DataSource;
    private static initializationPromise: Promise<boolean> | null = null;

    public static async initialize(): Promise<boolean> {
        if (!AppDataSource.dataSource) {
            AppDataSource.dataSource = new DataSource({
                type: "postgres",
                host: process.env.POSTGRES_HOST,
                port: Number(process.env.POSTGRES_PORT),
                username: process.env.POSTGRES_USER,
                password: process.env.POSTGRES_PASSWORD,
                database: process.env.POSTGRES_DB,
                entities: [User, Chat, Message],
                synchronize: false,
            });
        }

        if (!AppDataSource.initializationPromise) {
            AppDataSource.initializationPromise = AppDataSource.dataSource.initialize()
                .then(() => {
                    console.log("Database initialized successfully.");
                    return true;
                })
                .catch((error) => {
                    console.error("Couldn't initialize database: " + error);
                    return false;
                });
        }

        return AppDataSource.initializationPromise;
    }

    public static getInstance(): DataSource {
        if (!AppDataSource.dataSource) {
            throw new Error("DataSource is not initialized. You must call `AppDataSource.initialize()` before using `getInstance()`.");
        }

        if (!AppDataSource.dataSource.isInitialized) {
            throw new Error("DataSource initialization is still in progress. Await initialization before proceeding.");
        }

        return AppDataSource.dataSource;
    }
}


