## API design
Note: Asked teacher if authentication, etc. had to implemented as well, agreed that a simple "select" list with users was good enough.

### API documentation
Each API-call is documented as followed:
#### `TypeOfRequest` `Endpoint`
- `Requirements`: required parameters
- `Filters`: what kind of filter parameters are available
- `Response`:
    `response status code` the expected response
- `Exceptions`:
    `response status code`: responses when exceptions occur

Below each specification will also be a codeblock with the respose data, if no codeblock is shown it means the response does not contain any.

### API Documentation

### Website
#### **GET /**
- **Response:** 
    `301` Redirects to `/app`.
- **Exceptions:**
    - `302` Redirect: If the user accesses the root URL `/`, they are redirected to `/app`.

```json
{
    "status": 302,
    "location": "/app"
}
```

---

#### **GET /app**
- **Response:** 
    `200` Serves the `app.html` file from the `www/pages` directory.
- **Exceptions:**
    - `404` Not Found: If the `app.html` file is missing or cannot be found.

---

#### **GET /login**
- **Response:** 
    `301` Redirects to `/app` (since authentication isn't implemented).
- **Exceptions:**
    - `302` Redirect: If the user accesses the `/login` URL, they are redirected to `/app`.

```json
{
    "status": 302,
    "location": "/app"
}
```

### Users
#### 1. **GET /users**
- **Requirements:**  
  - Optional query parameters:
    - `id` (number) - ID of the user to find
    - `name` (string or array of strings) - Name(s) of the user(s) to find

- **Filters:**  
  No additional filters implemented yet (e.g., sorting or order options).

- **Response:**  
  `200` A list of users or a single user if `id` is provided.

```json
[
    {
        "userId": 1,
        "name": "userA"
    },
    {
        "userId": 2,
        "name": "userB"
    }
]
```

- **Exceptions:**  
    - `404` if no users are found.
    - `500` if an issue occurs while fetching users.
    
```json
{
    "message": "/users/search: Couldn't fetch users: error message"
}
```

---

#### 2. **GET /users/:id/chats**
- **Requirements:**  
  - `id` (number) - The ID of the user whose chats you want to fetch

- **Response:**  
  `200` A list of chats the user is part of.

```json
[
    {
        "chatId": 1,
        "participants": ["userA", "userB"],
        "content": "Hello!"
    },
    {
        "chatId": 2,
        "participants": ["John Doe", "Someone Else"],
        "content": "How are you?"
    }
]
```

- **Exceptions:**  
    - `400` if `id` is not provided or invalid.
    - `404` if the user is not found.
    - `500` if an issue occurs while fetching chats.
    
```json
{
    "message": "Couldn't determine user id."
}
```

---

#### 3. **POST /users/create**
- **Requirements:**  
  - `name` (string) - Name of the user to create

- **Response:**  
  `201` if the user is successfully created.

- **Exceptions:**  
    - `400` if the `name` parameter is missing.
    - `500` if an issue occurs while creating the user.
    
```json
{
    "message": "/users/create: name parameter not found."
}
```

---

#### 4. **PUT /users/update**
- **Requirements:**  
  - `id` (number) - ID of the user to update
  - `name` (string) - New name of the user

- **Response:**  
  `200` if the user is successfully updated.

- **Exceptions:**  
    - `400` if `id` or `name` parameters are missing.
    - `404` if the user is not found.
    - `500` if an issue occurs while updating the user.
    
```json
{
    "message": "/users/update: Couldn't search for user: error message"
}
```

---

#### 5. **DELETE /users/delete**
- **Requirements:**  
  - `id` (string) - ID of the user to delete

- **Response:**  
  `204` if the user is successfully deleted.

- **Exceptions:**  
    - `400` if `id` is not provided.
    - `404` if the user is not found.
    - `500` if an issue occurs while deleting the user.
    
```json
{
    "message": "/users/delete: Couldn't determine id parameter."
}
```

### Chats
#### 1. **GET /chat/:id/messages**
- **Requirements**: `id` (Chat ID)
- **Response**: 
    `200` Returns all messages that are part of the chat.
- **Exceptions**:
    - `400`: If the `id` parameter is missing or invalid.
    - `404`: If no chat is found with the provided `id`.
    - `500`: If an error occurs while fetching messages.

```json
[
    {
        "id": 1,
        "sender": "UserA",
        "content": "message",
        "timestamp": "2000-01-01T00:00:00Z"
    },
    {
        "id": 2,
        "sender": "User 2",
        "content": "message",
        "timestamp": "2000-01-01T00:00:00Z"
    }
]
```

---

#### 2. **GET /chat/:id/users**
- **Requirements**: `id` (Chat ID)
- **Response**: 
    `200` Returns all users that are part of the chat.
- **Exceptions**:
    - `400`: If the `id` parameter is missing or invalid.
    - `404`: If no chat is found with the provided `id`.
    - `500`: If an error occurs while fetching users.

```json
[
    "chatId": 1,
    "name": "name",
    "__participants__": [
        {
            "userId": 1,
            "name": "userA",
            "profile": {
                "profileId": 1,
                "profileImageURL": "url"
            }
        },
        {
            "userId": 2,
            "name": "userB",
            "profile": {
                "profileId": 2,
                "profileImageURL": "url"
            }
        }
    ]
]
```

---

#### 3. **POST /chat/:id/messages/create**
- **Requirements**:
    - `id` (Chat ID in URL)
    - `sender` (User ID in request body)
    - `content` (Message content in request body)
- **Response**: 
    `201` No response body
- **Exceptions**:
    - `400`: If `chatId`, `senderId`, or `content` is missing or invalid.
    - `404`: If the chat or user is not found with the provided `id`.
    - `500`: If an error occurs while creating the message.

---

#### 4. **POST /chat/create**
- **Requirements**:
    - `name` (Chat name in request body)
    - `participants` (Array of participant user IDs in request body)
- **Response**: 
    `200` No response body
- **Exceptions**:
    - `400`: If `name` or `participants` is missing or invalid.
    - `500`: If an error occurs while creating the chat.

---

#### 5. **POST /chat/:id/join**
- **Requirements**:
    - `id` (Chat ID in URL)
    - `userId` (User ID in request body)
- **Response**: 
    `200` No response body
- **Exceptions**:
    - `400`: If `chatId` or `userId` is missing or invalid.
    - `404`: If the chat or user is not found with the provided `id`.
    - `500`: If an error occurs while joining the chat.
