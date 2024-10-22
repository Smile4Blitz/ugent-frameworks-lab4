import express, { Request, Response, Application } from 'express';
import { UserRepository } from '../repository/UserRepository';
import { User } from '../entity/User';

export class UserController {
    private app: Application;
    private repository: UserRepository;

    constructor(app: Application) {
        this.app = app;
        this.repository = new UserRepository();
        this.setupRoutes();
    }

    private setupRoutes(): void {
        // get users, optional filter: id or name
        this.app.get('/users', async (req: Request, res: Response) => {
            const id = req.query.id;
            const names = req.query.name; // string or Array<String>

            try {
                if (id != undefined) {
                    const users = await this.repository.findById(Number(id));
                    users ? res.send(users) : res.status(404).json({}).send();
                } else if (names != undefined) {
                    var nameArray: string[] = Array.isArray(names) ? names.map(String) : [String(names)];
                    nameArray = nameArray.map(name => name.toLowerCase());

                    const users = await this.repository.findByName(nameArray);
                    users ? res.send(users) : res.status(404).json({}).send();
                } else {
                    const users = await this.repository.findAllUsers();
                    users ? res.send(users) : res.status(404).json({}).send();
                }
            } catch (error) {
                res.status(500).send({ message: "/users/search: Couldn't fetching users: " + error });
            }
        });

        this.app.post('/users/create', express.json(), async (req: Request, res: Response) => {
            const name = req.body.name;

            try {
                const user = await this.repository.createUser(name);
                res.status(201).send(user);
            } catch (error) {
                res.status(400).json({ message: "/users/create: Couldn't create user: " + error }).send();
            }
        });

        this.app.put('/users/update', express.json(), async (req: Request, res: Response) => {
            const id = req.body.id;
            const name = req.body.name;
            var user: User | undefined;

            // find user
            try {
                user = await this.repository.findById(Number(id));
            } catch (error) {
                res.status(400).json({ message: "/users/update: Couldn't search for user: " + error });
                return;
            }

            // check if user was found
            if (user == undefined) {
                res.status(400).json({ message: "/users/update: Couldn't find user." }).send();
                return;
            }

            // update user
            user.name = name;
            const updateSuccess: Boolean = await this.repository.updateUser(user);

            // send update result
            if (updateSuccess)
                res.status(201).send(user);
            else
                res.status(400).json({ message: "/users/update: Couldn't update user." });
        });

        this.app.delete('/users/delete', express.json(), async (req: Request, res: Response) => {
            const id = req.body.id;
            var user: User | undefined;

            // find user
            try {
                user = await this.repository.findById(Number(id));
            } catch (error) {
                res.status(400).json({ message: "/users/delete: Couldn't search for user: " + error });
                return;
            }

            // check if user was found
            if (user == undefined) {
                res.status(400).json({ message: "/users/delete: Couldn't find user." }).send();
                return;
            }

            const deleteSuccess = await this.repository.deleteUser(user.userId);
            if (deleteSuccess)
                res.status(201).send();
            else
                res.status(400).json({ message: "/users/delete: Couldn't update user." });
        });
    }

}
