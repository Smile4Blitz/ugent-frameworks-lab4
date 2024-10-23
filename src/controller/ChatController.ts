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

    constructor(app: Application, userRepository: UserRepository, chatRepository: ChatRepository, messageRepository : MessageRepository) {
        super(app);
        this.chatRepository = chatRepository;
        this.userRepository = userRepository;
        this.messageRepository = messageRepository;
        this.setupRoutes();
    }

    protected setupRoutes(): void {
        // get messages from a chat
        this.app.get('/chat/:id/messages', async (req: Request, res: Response) => {
            // check parameters are present
            const chatId = Number(req.params.id).valueOf();
            console.log("looking for chat " + chatId + " messages.");
            if (chatId === undefined) {
                res.status(400).send({ message: "/chat/:id/messages: Couldn't find id query parameter." });
                return;
            }

            // check if chat with id exists
            const chat: Chat | null = await this.chatRepository.findById(chatId); // fails on joinColumns
            if (chat == null) {
                res.status(400).send({ message: "/chat/:id/messages: Chat with chatId " + req.params.id + " doesn't exist." });
                return;
            }

            // get all messages from chat
            var messages: Message[] | undefined;
            try {
                messages = await this.messageRepository.getChatMessages(chat);
            } catch (error) {
                res.status(400).send({ message: "/chat/search: couldn't determine chatId: " + error });
                return;
            }

            if (messages)
                res.status(200).send(messages);
            else
                res.status(404).send({ message: "/chat/search: couldn't find messages for chatId: " + Number(req.query.id).valueOf() });
        });

        // create message in a chat
        this.app.post('/chat/:id/messages/create', express.json(), async (req: Request, res: Response) => {
            // get & check params
            const chatId = Number(req.params.id).valueOf();
            const senderId = Number(req.body.sender).valueOf();
            const content = req.body.content;

            if (chatId === undefined || senderId == undefined || content == undefined) {
                res.status(400).send({ message: "/chat/:id/messages/create: Couldn't find all required parameters." });
                return;
            }

            // find chat
            console.log("Looking for chat with id " + chatId);
            const chat: Chat | null = await this.chatRepository.findById(chatId);
            if (chat == null) {
                res.status(400).send({ message: "/chat/:id/messages: Couldn't find chat with id " + req.query.id });
                return;
            }
            
            // find sender
            console.log("Looking for user with id " + senderId);
            const sender: User | undefined = await this.userRepository.findById(senderId);
            if (sender == undefined) {
                res.status(400).send({ message: "/chat/:id/messages: Couldn't find user with id " + req.query.sender });
                return;
            }

            // create message
            console.log("Creating message for chat: " + chat.chatId + " send by " + sender.name + " with message " + content);
            const message: Message = await this.messageRepository.createMessage(chat, sender, content);
            this.chatRepository.addMessage(chat, message);

            res.status(201).send();
        });

        // create a chat
        this.app.post('/chat/create', express.json(), async (req: Request, res: Response) => {
            const name = req.body.name;
            const participants = req.body.participants;

            // check parameters
            if (name == undefined || participants == undefined) {
                res.status(400).send({ message: "/chat/create: Couldn't find param name or participants." });
                return;
            }

            // check all participants
            const users: Array<User> = new Array<User>();
            await Promise.all(participants.map(async (participant: { id: string; }) => {
                console.log("looking for user with id: " + Number(participant.id).valueOf());
                const user: User | undefined = await this.userRepository.findById(Number(participant.id).valueOf());
                if (user instanceof User) {
                    console.log("adding " + user.name);
                    users.push(user);
                }
            }));

            // After all participants have been processed, check if users were found
            if (users.length > 0) {
                this.chatRepository.createChat(name, users);
                res.status(200).send({ message: "Chat created successfully" });
            } else {
                res.status(400).send({ message: "/chat/create: Couldn't find participants." });
            }
        });
    }

}