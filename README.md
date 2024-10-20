## Socials App
This is a messaging app, just like Whatsapp or Messenger you can send messages to users and groups.

### App Requirements

#### User
- **Find a user**: Search for users by name, email, or username.
- **Start a chat with a user**: Initiate a one-on-one conversation.
- **Mute a chat with a user**: Disable notifications for a specific chat.
- **Block a user**: Block a user.
- **View user profile**: See details like status, last seen, and profile picture.
- **Update user profile**: Change name, status, and profile picture.
- **Send friend request**: Connect with another user.

#### Group
- **Start a group with 1 or more users**: Create a chat group.
- **Mute a chat with a group**: Disable notifications for group messages.
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
   - **GET** `/users/search`
   - **Query Parameters:** `name`, `email`, `username`
   - **Response:** List of users matching the criteria.

2. **View User Profile**
   - **GET** `/users/{userId}`
   - **Response:** User profile details (name, status, last seen, profile picture).

3. **Update User Profile**
   - **PUT** `/users/{userId}`
   - **Request Body:** `{ "name": "...", "status": "...", "profilePicture": "..." }`
   - **Response:** Updated user profile.

4. **Block User**
   - **POST** `/users/{userId}/block`
   - **Response:** Confirmation of block.

5. **Mute Chat**
   - **POST** `/users/{userId}/mute`
   - **Response:** Confirmation of mute.

#### Group Endpoints

1. **Create Group**
   - **POST** `/groups`
   - **Request Body:** `{ "name": "...", "userIds": [...] }`
   - **Response:** Created group details.

2. **Leave Group**
   - **DELETE** `/groups/{groupId}/leave`
   - **Response:** Confirmation of leaving the group.

3. **Add Users to Group**
   - **POST** `/groups/{groupId}/add-users`
   - **Request Body:** `{ "userIds": [...] }`
   - **Response:** Updated group member list.

4. **Change Group Name**
   - **PUT** `/groups/{groupId}`
   - **Request Body:** `{ "name": "New Group Name" }`
   - **Response:** Updated group details.

5. **List Group Members**
   - **GET** `/groups/{groupId}/members`
   - **Response:** List of group members.

#### Message Endpoints

1. **Send Message to User**
   - **POST** `/messages/users/{userId}`
   - **Request Body:** `{ "content": "...", "attachments": [...] }`
   - **Response:** Sent message details.

2. **Send Message to Group**
   - **POST** `/messages/groups/{groupId}`
   - **Request Body:** `{ "content": "...", "attachments": [...] }`
   - **Response:** Sent message details.

#### Chat Endpoints

1. **List Messages in Chat**
   - **GET** `/chats/{chatId}/messages`
   - **Response:** List of messages in chronological order.

2. **Search Messages** // server or client-side?
   - **GET** `/chats/{chatId}/messages/search`
   - **Query Parameters:** `query`
   - **Response:** List of matching messages.

#### Additional Features

4. **Read Receipts**
   - **POST** `/messages/{messageId}/read`
   - **Response:** Confirmation of read receipt.

