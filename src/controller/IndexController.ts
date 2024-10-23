import { Request, Response, Application } from 'express';
import { AController } from '../interface/AController';
import path from 'path';

export class IndexController extends AController {
    constructor(app: Application) {
        super(app);
        this.setupRoutes();
    }

    protected setupRoutes(): void {
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
