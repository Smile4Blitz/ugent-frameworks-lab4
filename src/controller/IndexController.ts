import { Request, Response, Application } from 'express';
import path from 'path';

export class IndexController {
    private app: Application;

    constructor(app: Application) {
        this.app = app;
        this.setupRoutes();
    }

    private setupRoutes(): void {
        this.app.get('/', (req: Request, res: Response) => {
            res.sendFile(path.join(__dirname, '../www', 'index.html')); 
        });
    }
}
