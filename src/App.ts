import 'reflect-metadata';
import express, { Application } from 'express';
import { Admin, DataSource } from 'typeorm';
import { User } from './entity/User';
import { Chat } from './entity/Chat';
import { Message } from './entity/Message';
import path from 'path';
import { config } from 'dotenv';
import { UserRepository } from './repository/UserRepository';
import { ChatRepository } from './repository/ChatRepository';
import { MessageRepository } from './repository/MessageRepository';
import { IndexController } from './controller/IndexController';
import { UserController } from './controller/UserController';
import { ChatController } from './controller/ChatController';
import { Profile } from './entity/Profile';

class App {
    private app: Application;
    private rest_port: number;

    private userRepository?: UserRepository;
    private chatRepository?: ChatRepository;
    private messageRepository?: MessageRepository;

    constructor() {
        config();
        this.app = express();
        this.rest_port = Number(process.env.REST_PORT) || 3000;

        this.app.use(express.static(path.join(__dirname, 'www')));

        this.initialize();
    }

    private initialize(): void {
        const dataSource = new DataSource({
            type: "postgres",
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT),
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            entities: [User, Chat, Message, Profile, Admin],
            synchronize: true,
        });

        dataSource.initialize().then(() => {
            this.userRepository = new UserRepository(dataSource);
            this.chatRepository = new ChatRepository(dataSource);
            this.messageRepository = new MessageRepository(dataSource);

            new IndexController(this.app);
            new UserController(this.app, this.userRepository, this.chatRepository);
            new ChatController(this.app, this.userRepository, this.chatRepository, this.messageRepository);

            this.startListener();
        }).catch((error) => {
            console.error('Error during Data Source initialization:', error);
        });
    }

    public startListener(): void {
        this.app.listen(this.rest_port, () => {
            console.log(`Server is running on port ${this.rest_port}`);
        });
    }
}

const appInstance = new App();
