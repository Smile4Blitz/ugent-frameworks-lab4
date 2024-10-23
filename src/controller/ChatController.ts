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
        // get all messages that are part of a chat
        this.app.get('/chat/:id/messages', async (req: Request, res: Response) => {
            // parameters
            const chatId = Number(req.params.id);
            if (isNaN(chatId)) {
                return res.status(400).json({ message: "/chat/:id/messages: Couldn't determine id parameter." });
            }

            try {
                // find chat
                const chat: Chat | null = await this.chatRepository.findById(chatId);
                if (!chat) {
                    return res.status(404).json({ message: "/chat/:id/messages: Chat with chatId '" + chatId + "' doesn't exist." });
                }

                // find chat messages
                const messages: Message[] = await this.messageRepository.getChatMessages(chat);
                res.status(200).json(messages);
            } catch (error) {
                res.status(500).json({ message: "/chat/search: Couldn't get chat/messages." + error });
            }
        });

        // get all users that are part of a chat
        this.app.get('/chat/:id/users', async (req: Request, res: Response) => {
            // parameters
            const chatId = Number(req.params.id);
            if (isNaN(chatId)) {
                return res.status(400).json({ message: "Couldn't find id parameter." });
            }

            try {
                // find users that are part of this chat
                const chatParticipants = await this.chatRepository.getChatParticipantsWithProfiles(chatId);
                if (!chatParticipants) {
                    return res.status(404).json({ message: "Couldn't find chat with id." });
                }
                res.status(200).json(chatParticipants);
            } catch (error) {
                res.status(500).json({ message: "/chat/:id/users: Error retrieving users: " + error });
            }
        });

        // create a message in a chat
        this.app.post('/chat/:id/messages/create', express.json(), async (req: Request, res: Response) => {
            // parameters
            const chatId = Number(req.params.id);
            const senderId = Number(req.body.sender);
            const content = req.body.content;
            if (isNaN(chatId) || isNaN(senderId) || !content) {
                return res.status(400).json({ message: "/chat/:id/messages/create: Couldn't find all required parameters." });
            }

            try {
                // find chat using chatId
                const chat: Chat | null = await this.chatRepository.findById(chatId);
                if (!chat) {
                    return res.status(404).json({ message: "/chat/:id/messages: Couldn't find chat with id " + chatId });
                }

                // find user using senderId
                const sender: User | undefined = await this.userRepository.findById(senderId);
                if (!sender) {
                    return res.status(404).json({ message: "/chat/:id/messages: Couldn't find user with id " + senderId });
                }

                // create message
                const message: Message = await this.messageRepository.createMessage(chat, sender, content);
                const chatMessage = await this.chatRepository.addMessage(chat, message);
                if (!chatMessage) {
                    res.status(500).json({ message: "/chat/:id/messages: Couldn't create message for chat & user" });
                    return;
                }
                res.status(201).send();
            } catch (error) {
                res.status(500).json({ message: "/chat/:id/messages: Couldn't get chat or user." });
            }
        });

        // create a chat
        this.app.post('/chat/create', express.json(), async (req: Request, res: Response) => {
            // parameters
            const name = req.body.name;
            const participants = req.body.participants;

            if (!name || !participants || !Array.isArray(participants)) {
                return res.status(400).json({ message: "/chat/create: Missing name or participants in request body." });
            }

            // get all participant users
            const users: User[] = [];
            await Promise.all(participants.map(async (participant: { id: string }) => {
                const user = await this.userRepository.findById(Number(participant.id));
                if (user) users.push(user);
            }));

            if (users.length < 1) {
                res.status(400).json({ message: "/chat/create: No valid participants found." });
            }

            // create chat with users
            try {
                await this.chatRepository.createChat(name, users);
                res.status(201).send();
            }
            catch (error) {
                res.status(500).json({ message: "/chat/create: An error occurred while trying to create the chat." + error });
            }
        });

        // join an existing chat, UNTESTED
        this.app.post('/chat/:id/join', async (req: Request, res: Response) => {
            // parameters
            const chatId = Number(req.params.id).valueOf();
            const { userId } = req.body.id;

            if (isNaN(chatId) || isNaN(userId))
                return res.status(400).json({ message: "/chat/:id/join: Missing chatId or userId parameter." });

            // find chat & user
            const chat = await this.chatRepository.findById(chatId);
            const user = await this.userRepository.findById(userId);

            if (!chat || !user)
                return res.status(404).json({ message: "/chat/:id/join: Couldn't find chat or user with id." });

            // add user to chat
            try {
                await this.chatRepository.joinChat(chat, user);
                res.status(200).send();
            } catch (error) {
                res.status(500).json({ message: '/chat/:id/join: Error joining chat' });
            }
        });
    }
}
