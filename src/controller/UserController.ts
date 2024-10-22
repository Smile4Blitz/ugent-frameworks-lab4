import express, { Request, Response, Application } from 'express';
import { UserRepository } from '../repository/UserRepository';
import { User } from '../entity/User';
import { ChatRepository } from '../repository/ChatRepository';

export class UserController {
    private app: Application;
    private userRepository: UserRepository;
    private chatRepository: ChatRepository;

    constructor(app: Application) {
        this.app = app;
        this.userRepository = new UserRepository();
        this.chatRepository = new ChatRepository();
        this.setupRoutes();
    }

    private setupRoutes(): void {
        // get all users, optional filter: id or name
        this.app.get('/users', async (req: Request, res: Response) => {
            const id = req.query.id;
            const names = req.query.name; // string or Array<String>

            try {
                if (id != undefined) {
                    const users = await this.userRepository.findById(Number(id));
                    users ? res.send(users) : res.status(404).json({}).send();
                } else if (names != undefined) {
                    var nameArray: string[] = Array.isArray(names) ? names.map(String) : [String(names)];
                    nameArray = nameArray.map(name => name.toLowerCase());

                    const users = await this.userRepository.findByName(nameArray);
                    users ? res.send(users) : res.status(404).json({}).send();
                } else {
                    const users = await this.userRepository.findAllUsers();
                    users ? res.send(users) : res.status(404).json({}).send();
                }
            } catch (error) {
                res.status(500).send({ message: "/users/search: Couldn't fetching users: " + error });
            }
        });

        // get all chats that the user is part of
        this.app.get('/users/:id/chats', async (req: Request, res: Response) => {
            if (Number(req.params.id).valueOf() == undefined) {
                res.status(400).send({ message: "Couldn't determine user id." });
                return;
            }

            const user : User | undefined = await this.userRepository.findById(Number(req.params.id).valueOf());
            if (user == undefined) {
                res.status(400).send({ message: "Couldn't find user with id " + req.params.id });
                return;
            }

            const chats = await this.chatRepository.findAllUsersIdChats(user);
            res.status(200).send(chats);
        });

        this.app.post('/users/create', express.json(), async (req: Request, res: Response) => {
            const name = req.body.name;

            try {
                const user = await this.userRepository.createUser(name);
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
                user = await this.userRepository.findById(Number(id));
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
            const updateSuccess: Boolean = await this.userRepository.updateUser(user);

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
                user = await this.userRepository.findById(Number(id));
            } catch (error) {
                res.status(400).json({ message: "/users/delete: Couldn't search for user: " + error });
                return;
            }

            // check if user was found
            if (user == undefined) {
                res.status(400).json({ message: "/users/delete: Couldn't find user." }).send();
                return;
            }

            const deleteSuccess = await this.userRepository.deleteUser(user.userId);
            if (deleteSuccess)
                res.status(201).send();
            else
                res.status(400).json({ message: "/users/delete: Couldn't update user." });
        });
    }

}
