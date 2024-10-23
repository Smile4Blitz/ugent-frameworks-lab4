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
        this.app.get('/users', async (req: Request, res: Response) => {
            const id = req.query.id;
            const names = req.query.name;

            try {
                if (id !== undefined) {
                    const user = await this.userRepository.findById(Number(id));
                    user ? res.send(user) : res.status(404).send();
                } else if (names !== undefined) {
                    const nameArray: string[] = Array.isArray(names) ? names.map(String) : [String(names)];
                    const users = await this.userRepository.findByName(nameArray.map(name => name.toLowerCase()));
                    users ? res.send(users) : res.status(404).send();
                } else {
                    const users = await this.userRepository.findAllUsers();
                    users ? res.send(users) : res.status(404).send();
                }
            } catch (error) {
                res.status(500).send({ message: "/users/search: Couldn't fetch users: " + error });
            }
        });

        this.app.get('/users/:id/chats', async (req: Request, res: Response) => {
            const userId = Number(req.params.id);

            if (isNaN(userId)) {
                return res.status(400).send({ message: "Couldn't determine user id." });
            }

            try {
                const user = await this.userRepository.findById(userId);
                if (!user) {
                    return res.status(404).send({ message: "Couldn't find user with id " + req.params.id });
                }

                const chats = await this.chatRepository.findAllUsersIdChats(user);
                res.status(200).send(chats);
            } catch (error) {
                res.status(500).json({ message: "Couldn't look for user with id." });
            }
        });

        this.app.post('/users/create', express.json(), async (req: Request, res: Response) => {
            const name: string | undefined = req.body.name;

            if (!name) {
                return res.status(400).json({ message: "/users/create: name parameter not found." });
            }

            try {
                const user = await this.userRepository.createUser(name);
                res.status(201).send(user);
            } catch (error) {
                res.status(500).json({ message: "/users/create: Couldn't create user: " + error });
            }
        });

        this.app.put('/users/update', express.json(), async (req: Request, res: Response) => {
            const id = Number(req.body.id);
            const name = req.body.name;

            if (isNaN(id) || !name) {
                return res.status(400).json({ message: "/users/update: Couldn't find id and user parameter." });
            }

            try {
                const user = await this.userRepository.findById(id);
                if (!user) {
                    return res.status(404).json({ message: "/users/update: Couldn't find user." });
                }

                user.name = name;
                const updateSuccess: Boolean = await this.userRepository.updateUser(user);

                if (updateSuccess) {
                    res.status(200).send(user);
                } else {
                    res.status(500).json({ message: "/users/update: Couldn't update user." });
                }
            } catch (error) {
                res.status(500).json({ message: "/users/update: Couldn't search for user: " + error });
            }
        });

        this.app.delete('/users/delete', express.json(), async (req: Request, res: Response) => {
            const id: string | undefined = req.body.id;

            if (!id) {
                return res.status(400).json({ message: "/users/delete: Couldn't determine id parameter." });
            }

            try {
                const user = await this.userRepository.findById(Number(id));
                if (!user) {
                    return res.status(404).json({ message: "/users/delete: Couldn't find user." });
                }

                const deleteSuccess = await this.userRepository.deleteUser(user.userId);
                deleteSuccess ? res.status(204).send() : res.status(500).json({ message: "/users/delete: Couldn't delete user." });
            } catch (error) {
                res.status(500).json({ message: "/users/delete: Couldn't search for user: " + error });
            }
        });
    }
}
