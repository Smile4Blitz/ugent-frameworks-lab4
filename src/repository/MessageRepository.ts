import { DataSource, Repository } from "typeorm";
import { Message } from "../entity/Message";
import { AppDataSource } from "../data/DataSource";
import { Chat } from "../entity/Chat";
import { User } from "../entity/User";

export class MessageRepository {
    private dataSource: DataSource;
    private repository: Repository<Message>;

    constructor() {
        this.dataSource = AppDataSource.getInstance();
        this.repository = this.dataSource.getRepository(Message);
    }

    public async findById(messageId: number): Promise<Message | undefined> {
        const result = await this.repository.findOne({ where: { messageId } });
        return result != null ? result : undefined;
    }

    public async createMessage(
        chat: Chat,
        sender: User,
        content: string
    ): Promise<Message> {
        const message = this.repository.create({
            chat,
            sender,
            content,
            timestamp: new Date(),
        });
        return this.repository.save(message);
    }
}
