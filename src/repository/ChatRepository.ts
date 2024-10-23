import { DataSource, Repository } from "typeorm";
import { Chat } from "../entity/Chat";
import { AppDataSource } from "../data/DataSource";
import { ARepository } from "../interface/ARepository";
import { User } from "../entity/User";
import { Message } from "../entity/Message";

export class ChatRepository extends ARepository {

    private repository: Repository<Chat>;

    constructor() {
        super();
        this.repository = this.dataSource.getRepository(Chat);
    }

    public async findById(chatId: number): Promise<Chat | null> {
        return this.repository.findOne({
            where: { chatId },
            relations: ["participants", "messages"],
        });
    }

    public async findAllUsersIdChats(user: User): Promise<Chat[]> {
        return await this.repository
            .createQueryBuilder("chat")
            .innerJoin("chat.participants", "participant")
            .where("participant.userId = :userId", { userId: user.userId })
            .getMany();
    }

    public async createChat(name: string, participants: User[]): Promise<Chat> {
        const chat = this.repository.create({
            name: name,
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
}