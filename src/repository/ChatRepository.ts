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

    public async findById(chatId: number): Promise<Chat | null> {
        return this.repository.findOne({
            where: { chatId },
            relations: ["participants", "messages"],
        });
    }

    public async createChat(name: string, participants: User[]): Promise<Chat> {
        const chat = this.repository.create({
            name: "Chat",
            participants,
        });
        return this.repository.save(chat);
    }

    public async addMessage(chat: Chat, message: Message): Promise<Chat | undefined> {
        chat.messages.push(message);
        return this.repository.save(chat);
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