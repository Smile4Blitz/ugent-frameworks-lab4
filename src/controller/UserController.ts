import { Request, Response, Application } from 'express';
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
                    console.log("Finding users: id defined");
                    const users = await this.repository.findById(Number(id));
                    users ? res.send(users) : res.status(404).json({}).send();
                } else if (names != undefined) {
                    console.log("Finding users: name(s) defined");
                    
                    var nameArray: string[] = Array.isArray(names) ? names.map(String) : [String(names)];
                    nameArray = nameArray.map(name => name.toLowerCase());

                    const users = await this.repository.findByName(nameArray);
                    users ? res.send(users) : res.status(404).json({}).send();
                } else {
                    console.log("Finding users: no param");
                    const users = await this.repository.findAllUsers();
                    users ? res.send(users) : res.status(404).json({}).send();
                }
            } catch (error) {
                console.error("Error fetching users:", error);
                res.status(500).send("Internal Server Error");
            }
        });

        this.app.post('/users', async (req: Request, res: Response) => {
            const name = req.query.name;

            if (typeof name == 'string') {
                const user = await this.repository.createUser(name);
                res.status(201).send(user);
            } else {
                res.status(400).json({ message: "input should be of type string." }).send();
            }
        });
    }

}
