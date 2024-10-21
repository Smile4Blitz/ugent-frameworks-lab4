## Socials App
This is a messaging app, just like Whatsapp or Messenger you can send messages to users and groups.

### App Requirements

#### User
- **Find a user**: Search for users by name, email, or username.
- **Start a chat with a user**: Initiate a one-on-one conversation.
- **Mute a chat with a user**: Disable notifications for a specific chat.
- **Block a user**: Block a user.
- **Update user profile**: Change name or username.

#### Group
- **Start a group with 1 or more users**: Create a chat group.
- **Leave a group**: Exit a group chat.
- **Block a group**: Prevent messages from a group.
- **Add users to a group**: Add users to the group.
- **Change group name**: Update the group’s title.
- **List group members**: See who is in the group.
  
#### Message
- **Send a message to a specific user**: Direct message.
- **Send a message to a group**: Broadcast message to group members.
- **Receive a message from a specific user**: Handle direct messages.
- **Receive a message from a group**: Handle group messages.
- **Message can contain non-string objects (images, video)**: Support multimedia content (urls & types on client-side?)

#### Chat
- **Add users**: Include additional participants in a chat.
- **List messages in chronological order (timestamp)**: View messages in the order they were sent.
- **Pin important messages**: Keep essential messages at the top of the chat (filters?)

#### Additional Features
- **Read receipts**: Indicate when a message has been read.
- **Chat history**: Save past conversations for later access.

### API Design
API design based on the above summarized feature requirements.

#### User Endpoints

1. **Search Users**
   - **GET** `/users`
   - **Query Parameters:** `id`, `name`, `username`
   - **Response:** List of users matching the criteria.

2. **Update User Profile**
   - **PUT** `/users/{userId}`
   - **Request Body:** `{ "name": "...", "username" : "..." }`
   - **Response:** Updated user profile.

3. **Delete User Profile**
   - **DELETE** `/users/{userId}`
   - **Response:** Confirmation of delete.

#### Chat Endpoints

1. **Create a Chat**
   - **POST** `/chats/{chatId}/create`
   - **Request Body** `{ "name" : "...", "participants" : [names or IDs] }`
   - **Response:** Reference to chat message endpoint

2. **Send Messages in Chat**
   - **POST** `/chats/{chatId}/send`
   - **Request Body** `{ "content": "..." }`
   - **Response:** Confirmation of send.

3. **List Messages in Chat**
   - **GET** `/chats/{chatId}`
   - **Response:** List of messages in chronological order.
   - **Response:** List of all messages.

4. **Search Messages in Chat** // server or client-side? -> server-side
   - **GET** `/chats/{chatId}`
   - **Query Parameters:** `content`
   - **Response:** List of matching messages.

5. **Leave a Chat**
   - **DELETE** `/chats/{chatId}/leave`
   - **Request Body** `{ "" }`
   - **Response:** Confirmation of leave.

#### Additional Features

4. **Read Receipts**
   - **POST** `/messages/{messageId}/read`
   - **Response:** Confirmation of read receipt.

