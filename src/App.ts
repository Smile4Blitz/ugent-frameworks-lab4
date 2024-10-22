import express, { Application } from 'express';
import { IndexController } from './controller/IndexController';
import { UserController } from './controller/UserController';
import { config } from 'dotenv';
import { AppDataSource } from './data/DataSource';
import { ChatController } from './controller/ChatController';
import path from 'path';

class App {
    private app: Application;
    private rest_port: Number;

    constructor() {
        config();

        this.app = express();
        this.rest_port = Number(process.env.REST_PORT) || 3000;
        
        AppDataSource.initialize(); // db init & connection

        new IndexController(this.app);
        new UserController(this.app);
        new ChatController(this.app);

        this.app.use(express.static(path.join(__dirname, 'www'))); // for static files
    }

    public startListener(): void {
        this.app.listen(this.rest_port, () => {
            console.log('Server is running on port %s', this.rest_port);
        });
    }
}

const appliation: App = new App();
appliation.startListener();
