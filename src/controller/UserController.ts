import express, { Request, Response, Application } from 'express';
import { AController } from '../interface/AController';
import { UserRepository } from '../repository/UserRepository';
import { User } from '../entity/User';
import { ChatRepository } from '../repository/ChatRepository';

export class UserController extends AController {
    private userRepository: UserRepository;
    private chatRepository: ChatRepository;

    constructor(app: Application, userRepository: UserRepository, chatRepository: ChatRepository) {
        super(app);
        this.userRepository = userRepository;
        this.chatRepository = chatRepository;
        this.setupRoutes();
    }

    protected setupRoutes(): void {
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
            const userId = Number(req.params.id).valueOf();
            if (userId == undefined) {
                res.status(400).send({ message: "Couldn't determine user id." });
                return;
            }

            var user: User | undefined = undefined;
            try {
                user = await this.userRepository.findById(userId);
            } catch (error) {
                res.status(500).json({ message: "Couldn't look for user with id." })
                return;
            }

            if (user == undefined) {
                res.status(404).send({ message: "Couldn't find user with id " + req.params.id });
                return;
            }

            const chats = await this.chatRepository.findAllUsersIdChats(user);
            res.status(200).send(chats);
        });

        this.app.post('/users/create', express.json(), async (req: Request, res: Response) => {
            const name: string | undefined = req.body.name;

            if (name == undefined) {
                res.status(400).json({ message: "/users/create: name parameter not found." });
                return;
            }

            try {
                const user = await this.userRepository.createUser(name);
                res.status(201).send(user);
            } catch (error) {
                res.status(500).json({ message: "/users/create: Couldn't create user: " + error }).send();
            }
        });

        this.app.put('/users/update', express.json(), async (req: Request, res: Response) => {
            const id = Number(req.body.id).valueOf();
            const name = req.body.name;
            var user: User | undefined;

            if (id === undefined || name === undefined)
                res.status(400).json({ message: "/users/update: Couldn't find id and user parameter." });

            // find user
            try {
                user = await this.userRepository.findById(id);
            } catch (error) {
                res.status(500).json({ message: "/users/update: Couldn't search for user: " + error });
                return;
            }

            // check if user was found
            if (user == undefined) {
                res.status(404).json({ message: "/users/update: Couldn't find user." }).send();
                return;
            }

            // update user
            user.name = name;
            const updateSuccess: Boolean = await this.userRepository.updateUser(user);

            // send update result
            if (updateSuccess)
                res.status(201).send(user);
            else
                res.status(500).json({ message: "/users/update: Couldn't update user." });
        });

        this.app.delete('/users/delete', express.json(), async (req: Request, res: Response) => {
            const id: string | undefined = req.body.id;
            var user: User | undefined;

            if (id === undefined)
                res.status(400).json({ message: "/users/delete: Couldn't determine id parameter." });

            // find user
            try {
                user = await this.userRepository.findById(Number(id));
            } catch (error) {
                res.status(500).json({ message: "/users/delete: Couldn't search for user: " + error });
                return;
            }

            // check if user was found
            if (user == undefined) {
                res.status(404).json({ message: "/users/delete: Couldn't find user." }).send();
                return;
            }

            const deleteSuccess = await this.userRepository.deleteUser(user.userId);
            if (deleteSuccess)
                res.status(201).send();
            else
                res.status(500).json({ message: "/users/delete: Couldn't delete user." });
        });
    }

}
