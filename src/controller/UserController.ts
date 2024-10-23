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
        // get all users
        // TODO: right now if an id is present, we don't look for names
        // TODO: there's no sorting or order options
        this.app.get('/users', async (req: Request, res: Response) => {
            // parameters
            const id = Number(req.query.id).valueOf();
            const names = req.query.name;

            try {
                // find users
                if (!isNaN(id)) {
                    const user = await this.userRepository.findById(id);
                    user ? res.status(200).json(user) : res.status(404).send();
                } else if (names) {
                    const nameArray: string[] = Array.isArray(names) ? names.map(String) : [String(names)];
                    const users = await this.userRepository.findByName(nameArray.map(name => name.toLowerCase()));
                    users ? res.status(200).json(users) : res.status(404).send();
                } else {
                    const users = await this.userRepository.findAllUsers();
                    users ? res.status(200).json(users) : res.status(404).send();
                }
            } catch (error) {
                res.status(500).json({ message: "/users/search: Couldn't fetch users: " + error });
            }
        });

        // get all chats the user is part of
        this.app.get('/users/:id/chats', async (req: Request, res: Response) => {
            const userId = Number(req.params.id);

            if (!userId) {
                return res.status(400).json({ message: "Couldn't determine user id." });
            }

            try {
                // get user
                const user = await this.userRepository.findById(userId);
                if (!user) {
                    return res.status(404).json({ message: "Couldn't find user with id " + req.params.id });
                }

                // get all chats the user is part of
                const chats = await this.chatRepository.findAllUsersIdChats(user);
                res.status(200).json(chats);
            } catch (error) {
                res.status(500).json({ message: "Couldn't look for user with id." });
            }
        });

        // create a user
        this.app.post('/users/create', express.json(), async (req: Request, res: Response) => {
            // parameters
            const name: string | undefined = req.body.name;

            if (!name)
                return res.status(400).json({ message: "/users/create: name parameter not found." });

            try {
                // create user
                const user = await this.userRepository.createUser(name);
                res.status(201).send();
            } catch (error) {
                res.status(500).json({ message: "/users/create: Couldn't create user: " + error });
            }
        });

        // update a user (limited to user.name)
        this.app.put('/users/update', express.json(), async (req: Request, res: Response) => {
            // parameters
            const id = Number(req.body.id);
            const name = req.body.name;

            if (!id || !name) {
                return res.status(400).json({ message: "/users/update: Couldn't find id and user parameter." });
            }

            try {
                // get user
                const user = await this.userRepository.findById(id);
                if (!user) {
                    return res.status(404).json({ message: "/users/update: Couldn't find user." });
                }

                // update user
                user.name = name;
                const updateSuccess: Boolean = await this.userRepository.updateUser(user);

                if (!updateSuccess)
                    return res.status(500).json({ message: "/users/update: Couldn't update user." });
                res.status(200).send();
            } catch (error) {
                res.status(500).json({ message: "/users/update: Couldn't search for user: " + error });
            }
        });

        // delete a user
        this.app.delete('/users/delete', express.json(), async (req: Request, res: Response) => {
            // params
            const id: string | undefined = req.body.id;

            if (!id) {
                return res.status(400).json({ message: "/users/delete: Couldn't determine id parameter." });
            }

            try {
                // get user
                const user = await this.userRepository.findById(Number(id));
                if (!user) {
                    return res.status(404).json({ message: "/users/delete: Couldn't find user." });
                }

                // delete user
                const deleteSuccess = await this.userRepository.deleteUser(user.userId);
                deleteSuccess ? res.status(204).send() : res.status(500).json({ message: "/users/delete: Couldn't delete user." });
            } catch (error) {
                res.status(500).json({ message: "/users/delete: Couldn't search for user: " + error });
            }
        });
    }
}
