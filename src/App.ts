import express, { Application } from 'express';
import { IndexController } from './controller/IndexController';
import { UserController } from './controller/UserController';
import { config } from 'dotenv';
import { AppDataSource } from './data/DataSource';
import { ChatController } from './controller/ChatController';
import path from 'path';
import { UserRepository } from './repository/UserRepository';
import { ChatRepository } from './repository/ChatRepository';
import { MessageRepository } from './repository/MessageRepository';

class App {
    private app: Application;
    private rest_port: Number;

    private userRepository?: UserRepository;
    private chatRepository?: ChatRepository;
    private messageRepository?: MessageRepository;

    constructor() {
        // load .env, app & port
        config();
        this.app = express();
        this.rest_port = Number(process.env.REST_PORT) || 3000;

        // static files
        this.app.use(express.static(path.join(__dirname, 'www')));

        this.initialize();
    }

    private async initialize() : Promise<void> {
        // db init & connection
        await AppDataSource.initialize();

        // repositories
        this.userRepository = new UserRepository();
        this.chatRepository = new ChatRepository();
        this.messageRepository = new MessageRepository();

        // controllers
        new IndexController(this.app);
        new UserController(this.app, this.userRepository, this.chatRepository);
        new ChatController(this.app, this.userRepository, this.chatRepository, this.messageRepository);
    }

    public startListener(): void {
        this.app.listen(this.rest_port, () => {
            console.log('Server is running on port %s', this.rest_port);
        });
    }
}

const appliation: App = new App();
appliation.startListener();
