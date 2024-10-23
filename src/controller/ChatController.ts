import express, { Application, Request, Response } from 'express';
import { ChatRepository } from '../repository/ChatRepository';
import { AController } from '../interface/AController';
import { Message } from '../entity/Message';
import { UserRepository } from '../repository/UserRepository';
import { User } from '../entity/User';
import { Chat } from '../entity/Chat';
import { MessageRepository } from '../repository/MessageRepository';

export class ChatController extends AController {
    private chatRepository: ChatRepository;
    private userRepository: UserRepository;
    private messageRepository: MessageRepository;

    constructor(app: Application, userRepository: UserRepository, chatRepository: ChatRepository, messageRepository: MessageRepository) {
        super(app);
        this.chatRepository = chatRepository;
        this.userRepository = userRepository;
        this.messageRepository = messageRepository;
        this.setupRoutes();
    }

    protected setupRoutes(): void {
        this.app.get('/chat/:id/messages', async (req: Request, res: Response) => {
            const chatId = Number(req.params.id);
            if (isNaN(chatId)) {
                return res.status(400).send({ message: "/chat/:id/messages: Couldn't find id query parameter." });
            }

            const chat: Chat | null = await this.chatRepository.findById(chatId);
            if (!chat) {
                return res.status(404).send({ message: "/chat/:id/messages: Chat with chatId " + chatId + " doesn't exist." });
            }

            try {
                const messages: Message[] = await this.messageRepository.getChatMessages(chat);
                res.status(200).send(messages);
            } catch (error) {
                res.status(500).send({ message: "/chat/search: couldn't determine chatId: " + error });
            }
        });

        this.app.get('/chat/:id/users', async (req: Request, res: Response) => {
            const chatId = Number(req.params.id);
            if (isNaN(chatId)) {
                return res.status(400).json({ message: "Couldn't find id parameter." });
            }

            try {
                const chatParticipants = await this.chatRepository.getChatParticipantsWithProfiles(chatId);
                if (!chatParticipants) {
                    return res.status(404).json({ message: "Couldn't find chat with id." });
                }
                res.status(200).json(chatParticipants);
            } catch (error) {
                res.status(500).json({ message: "/chat/:id/users: Error retrieving users: " + error });
            }
        });

        this.app.post('/chat/:id/messages/create', express.json(), async (req: Request, res: Response) => {
            const chatId = Number(req.params.id);
            const senderId = Number(req.body.sender);
            const content = req.body.content;

            if (isNaN(chatId) || isNaN(senderId) || !content) {
                return res.status(400).send({ message: "/chat/:id/messages/create: Couldn't find all required parameters." });
            }

            const chat: Chat | null = await this.chatRepository.findById(chatId);
            if (!chat) {
                return res.status(404).send({ message: "/chat/:id/messages: Couldn't find chat with id " + chatId });
            }

            const sender: User | undefined = await this.userRepository.findById(senderId);
            if (!sender) {
                return res.status(404).send({ message: "/chat/:id/messages: Couldn't find user with id " + senderId });
            }

            const message: Message = await this.messageRepository.createMessage(chat, sender, content);
            if (await this.chatRepository.addMessage(chat, message) != undefined) {
                res.status(201).send();
            } else {
                res.status(500).json({ message: "/chat/:id/messages: Couldn't create message for chat with id & user with id" });
            }
        });

        this.app.post('/chat/create', express.json(), async (req: Request, res: Response) => {
            const name = req.body.name;
            const participants = req.body.participants;

            if (!name || !participants || !Array.isArray(participants)) {
                return res.status(400).send({ message: "Missing name or participants in request body." });
            }

            const users: User[] = [];
            await Promise.all(participants.map(async (participant: { id: string }) => {
                const user = await this.userRepository.findById(Number(participant.id));
                if (user) users.push(user);
            }));

            if (users.length > 0) {
                try {
                    await this.chatRepository.createChat(name, users);
                    res.status(201).send({ message: "Chat created successfully." });
                } catch (error) {
                    res.status(500).send({ message: "An error occurred while creating the chat." });
                }
            } else {
                res.status(400).send({ message: "No valid participants found." });
            }
        });
    }
}
