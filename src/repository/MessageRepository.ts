import { DataSource, Repository } from "typeorm";
import { Message } from "../entity/Message";
import { Chat } from "../entity/Chat";
import { User } from "../entity/User";
import { ARepository } from "../interface/ARepository";

export class MessageRepository extends ARepository {
    private repository: Repository<Message>;

    constructor(dataSource: DataSource) {
        super(dataSource);
        this.repository = this.dataSource.getRepository(Message);
    }

    public async findById(messageId: number): Promise<Message | undefined> {
        const message: Message | null = await this.repository.findOne({ where: { messageId } });
        return message ? message : undefined;
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

    public async getChatMessages(chat: Chat): Promise<Message[]> {
        return this.repository
            .createQueryBuilder("message")
            .leftJoinAndSelect("message.sender", "sender")
            .where({ chat })
            .getMany();
    }
}
