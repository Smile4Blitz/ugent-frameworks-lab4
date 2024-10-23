import { Request, Response, Application } from 'express';
import { AController } from '../interface/AController';
import path from 'path';

export class IndexController extends AController {
    constructor(app: Application) {
        super(app);
        this.setupRoutes();
    }

    protected setupRoutes(): void {
        // NOTE: all redirect to /app since we don't have to
        // implement authentication for this project (asked teacher)

        // checks if user has session tokens & redirects to /app or /login
        this.app.get('/', (req: Request, res: Response) => {
            res.redirect('/app');
        });

        // application page
        this.app.get('/app', (req: Request, res: Response) => {
            res.sendFile(path.join(__dirname, '../www/pages', 'app.html'));
        });

        // login page
        this.app.get('/login', (req: Request, res: Response) => {
            res.redirect('/app');
        });
    }
}
