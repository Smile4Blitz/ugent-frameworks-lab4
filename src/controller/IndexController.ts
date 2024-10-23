import { Request, Response, Application } from 'express';
import { IController } from '../interface/IController';
import path from 'path';

export class IndexController implements IController {
    private app: Application;

    constructor(app: Application) {
        this.app = app;
        this.setupRoutes();
    }

    private setupRoutes(): void {
        this.app.get('/', (req: Request, res: Response) => {
            res.sendFile(path.join(__dirname, '../www/pages', 'index.html'));
        });

        this.app.get('/app', (req: Request, res: Response) => {
            res.sendFile(path.join(__dirname, '../www/pages', 'app.html'));
        });

        this.app.get('/login', (req: Request, res: Response) => {
            res.sendFile(path.join(__dirname, '../www/pages', 'login.html'));
        });
    }
}
