import { DataSource, Repository } from "typeorm";
import { Chat } from "../entity/Chat";
import { AppDataSource } from "../data/DataSource";
import { User } from "../entity/User";
import { Message } from "../entity/Message";

export class ChatRepository {
    private dataSource: DataSource;
    private repository: Repository<Chat>;

    constructor() {
        this.dataSource = AppDataSource.getInstance();
        this.repository = this.dataSource.getRepository(Chat);
    }

    public async findById(id: number): Promise<Chat | null> {
        return this.repository.findOne({
            where: { id },
            relations: ["participants", "messages"],
        });
    }

    public async createChat(type: string, participants: User[]): Promise<Chat> {
        const chat = this.repository.create({
            type,
            participants,
        });
        return this.repository.save(chat);
    }

    public async addMessage(chatId: number, message: Message): Promise<Chat | undefined> {
        const chat = await this.findById(chatId);
        if (chat) {
            chat.messages.push(message);
            return this.repository.save(chat);
        }
        return undefined;
    }

    public async findByUser(userId: number): Promise<Chat[]> {
        return this.repository
            .createQueryBuilder("chat")
            .leftJoinAndSelect("chat.participants", "user")
            .where("user.id = :userId", { userId })
            .getMany();
    }

    public async deleteChat(id: number): Promise<void> {
        await this.repository.delete(id);
    }

    public async getMessages(chatId: number): Promise<Message[] | undefined> {
        const chat = await this.findById(chatId);
        if (chat) {
            return chat.messages;
        }
        return undefined;
    }
}