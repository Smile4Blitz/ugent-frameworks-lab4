import { DataSource, Repository } from "typeorm";
import { Chat } from "../entity/Chat";
import { ARepository } from "../interface/ARepository";
import { User } from "../entity/User";
import { Message } from "../entity/Message";

export class ChatRepository extends ARepository {
    private repository: Repository<Chat>;

    constructor(dataSource: DataSource) {
        super(dataSource);
        this.repository = this.dataSource.getRepository(Chat);
    }

    // get all users, profiles and chat info
    public async findById(chatId: number): Promise<Chat | null> {
        return this.repository.findOne({
            where: { chatId },
            relations: ["participants", "messages"],
        });
    }

    // get all profiles of all users that are part of a chat
    public async getChatParticipantsWithProfiles(chatId: number): Promise<any> {
        return this.dataSource
            .getRepository(Chat)
            .createQueryBuilder('chat')
            .leftJoinAndSelect('chat.participants', 'user')
            .leftJoinAndSelect('user.profile', 'profile')
            .where('chat.chatId = :chatId', { chatId })
            .getOne();
    }

    // get all chats the user is part of
    public async findAllUsersIdChats(user: User): Promise<Chat[]> {
        return this.repository
            .createQueryBuilder("chat")
            .innerJoin("chat.participants", "participant")
            .where("participant.userId = :userId", { userId: user.userId })
            .getMany();
    }

    // create a chat
    public async createChat(name: string, participants: User[]): Promise<Chat> {
        const chat = this.repository.create({ name, participants });
        return this.repository.save(chat);
    }

    // add a message to a chat
    // TODO: in-use but possibly redundant since createMessage()
    // in message repo assigns a chat to each message it creates
    // TODO: move to message repo
    public async addMessage(chat: Chat, message: Message): Promise<Chat | undefined> {
        chat.messages.push(message);
        return this.repository.save(chat);
    }

    // join an existing chat
    // unused, untested
    public async joinChat(chat: Chat, user: User) {
        chat.participants.forEach(participant => {
            if (participant.userId == user.userId)
                return;
        });
        chat.participants.push(user);
    }
}
