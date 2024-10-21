import { DataSource, In, Repository } from "typeorm";
import { User } from "../entity/User";
import { AppDataSource } from "../data/DataSource";

export class UserRepository {
    private dataSource: DataSource;
    private repository: Repository<User>;

    constructor() {
        this.dataSource = AppDataSource.getInstance();
        this.repository = this.dataSource.getRepository(User);
    }

    public async findAllUsers(): Promise<User[] | undefined> {
        return this.repository.find();
    }

    // input should always be an Array<String> but leaving string option anyway since it maybe useful in the future
    public async findByName(name: string | Array<String>): Promise<User[] | undefined> {
        if (Array.isArray(name)) {
            return await this.repository.find({
                where: {
                    name: In(name),
                },
            });
        }
        else {
            const user = await this.repository.findOne({
                where: { name }
            });
            return user ? [user] : undefined;
        }
    }

    public async findById(id: number): Promise<User[] | undefined> {
        const user = await this.repository.findOne({ where: { id } });
        return user ? [user] : undefined;
    }

    public async createUser(name: string): Promise<User> {
        const user = this.repository.create({ name });
        return this.repository.save(user);
    }

    public async deleteUser(id: number): Promise<void> {
        await this.repository.delete(id);
    }
}
