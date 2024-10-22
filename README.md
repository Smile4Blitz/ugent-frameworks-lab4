## Socials App
This is a messaging app, just like Whatsapp or Messenger you can send messages to users and groups.

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

// alternatively: use get requests & their timestamps to indicate when the user was last reading the chat
4. **Read Receipts**
   - **POST** `/messages/{messageId}/read`
   - **Response:** Confirmation of read receipt.

