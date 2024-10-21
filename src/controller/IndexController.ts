import { Request, Response, Application } from 'express';

export class IndexController {
    private app: Application;

    constructor(app: Application) {
        this.app = app;
        this.setupRoutes();
    }

    private setupRoutes(): void {
        this.app.get('/', (req: Request, res: Response) => {
            res.send('Hello World!');
        });
    }
}
