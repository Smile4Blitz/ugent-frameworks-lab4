import { Application, Request, Response } from 'express';
import { AController } from '../interface/AController';
import { UserRepository } from '../repository/UserRepository';
import { InitializedRelationError } from 'typeorm';

export class AuthController extends AController {
    private userRepository: UserRepository;

    constructor(app: Application, userRepository: UserRepository) {
        super(app);
        this.userRepository = userRepository;
    }

    protected setupRoutes() {
        this.app.get('/auth', (req: Request, res: Response) => {
            res.status(200).send();
        });
    }
}
