import { DataSource, In, Repository } from "typeorm";
import { User } from "../entity/User";
import { ARepository } from "../interface/ARepository";

export class UserRepository extends ARepository {
    private repository: Repository<User>;

    constructor(dataSource: DataSource) {
        super(dataSource);
        this.repository = this.dataSource.getRepository(User);
    }

    public async findAllUsers(): Promise<User[]> {
        return this.repository.find();
    }

    public async findByName(name: string | string[]): Promise<User[]> {
        if (Array.isArray(name)) {
            return this.repository.find({
                where: { name: In(name) },
            });
        } else {
            const user = await this.repository.findOne({
                where: { name },
            });
            return user ? [user] : [];
        }
    }

    public async findById(userId: number): Promise<User | undefined> {
        const user: User | null = await this.repository.findOne({ where: { userId } });
        return user ? user : undefined;
    }

    public async createUser(name: string): Promise<User> {
        const user = this.repository.create({
            name,
            profile: {
                profileImageURL: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXJA32WU4rBpx7maglqeEtt3ot1tPIRWptxA&s'
            }
        });
        return this.repository.save(user);
    }

    public async deleteUser(id: number): Promise<boolean> {
        const result = await this.repository.delete(id);
        return result.affected !== 0;
    }

    public async updateUser(user: User): Promise<boolean> {
        const result = await this.repository.update({ userId: user.userId }, user);
        return result.affected !== 0;
    }
}
