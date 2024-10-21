import { DataSource, Repository } from "typeorm";
import { Message } from "../entity/Message";
import { AppDataSource } from "../data/DataSource";

export class MessageRepository {
    private dataSource : DataSource;
    private repository: Repository<Message>;

    constructor() {
        this.dataSource = AppDataSource.getInstance();
        this.repository = this.dataSource.getRepository(Message);
    }

    public async findById(id: number): Promise<Message | null> {
        return this.repository.findOne({ where: { id } });
    }

    public async createMessage(
        chatId: number,
        sender: string,
        receiver: string,
        content: string
    ): Promise<Message> {
        const message = this.repository.create({
            chatId,
            sender,
            receiver,
            content,
            timestamp: new Date(),
        });
        return this.repository.save(message);
    }

    public async findByChatId(chatId: number): Promise<Message[]> {
        return this.repository.find({
            where: { chatId },
            order: { timestamp: "ASC" }, // old first
        });
    }

    public async findBySenderInChat(chatId: number, sender: string): Promise<Message[]> {
        return this.repository.find({
            where: { chatId, sender },
            order: { timestamp: "ASC" },
        });
    }

    public async findBySenderAndReceiver(chatId: number, sender: string, receiver: string): Promise<Message[]> {
        return this.repository.find({
            where: { chatId, sender, receiver },
            order: { timestamp: "ASC" },
        });
    }

    public async deleteMessage(id: number): Promise<void> {
        await this.repository.delete(id);
    }
}
