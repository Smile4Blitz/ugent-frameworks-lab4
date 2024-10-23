const apiUrl = `${window.location.origin}`;

async function fetchUsers() {
    try {
        const response = await fetch(`${apiUrl}/users`);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

async function fetchChats(id) {
    console.log(`url: ${apiUrl}/users/${id}/chats`);
    try {
        const response = await fetch(`${apiUrl}/users/${id}/chats`);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('Error fetching chats:', error);
    }
}

async function populateChats() {
    const messageUsersDiv = document.getElementById('message-users-bounds');
    const activeProfile = document.getElementById('user-profile-select');

    messageUsersDiv.innerHTML = ''; // Clear previous content
    document.getElementById('message-chats-participants').innerHTML = '';
    document.getElementById('message-chats-bounds').innerHTML = '';

    const chats = await fetchChats(activeProfile.value);
    chats.forEach(chat => createChatCard(chat, messageUsersDiv));
}

function createChatCard(chat, container) {
    const chatCard = document.createElement('div');
    chatCard.className = 'user-card';

    const chatImage = document.createElement('div');
    chatImage.className = 'user-image';
    chatCard.appendChild(chatImage);

    const userImg = document.createElement('img');
    userImg.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXJA32WU4rBpx7maglqeEtt3ot1tPIRWptxA&s"; // placeholder
    userImg.alt = "profile image";
    chatImage.appendChild(userImg);

    const chatName = document.createElement('div');
    chatName.className = 'user-name';
    const chatNameSpan = document.createElement('span');
    chatNameSpan.innerText = chat.name; // chatName from REST-response
    chatName.appendChild(chatNameSpan);
    chatCard.appendChild(chatName);

    chatCard.addEventListener('click', () => {
        populateChatMessages(chat.chatId);
        populateChatParticipants(chat.chatId);
    });

    container.appendChild(chatCard);
}

async function fetchChatMessages(id) {
    try {
        const response = await fetch(`${apiUrl}/chat/${id}/messages`);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('Error fetching chat messages:', error);
    }
}

async function fetchChatUsers(id) {
    try {
        const response = await fetch(`${apiUrl}/chat/${id}/users`);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('Error fetching chat users:', error);
    }
}

async function populateChatMessages(id) {
    const chatMessageBlock = document.getElementById('message-chats-bounds');
    const activeProfile = document.getElementById('user-profile-select');
    chatMessageBlock.innerHTML = '';

    const messages = await fetchChatMessages(id);
    chatMessageBlock.setAttribute('chatid', id);

    messages.forEach(message => createMessageCard(message, chatMessageBlock, activeProfile.value));
}

function createMessageCard(message, container, activeProfileId) {
    const messageCard = document.createElement('div');
    messageCard.className = 'message-card';

    const messageType = document.createElement('div');
    messageType.className = message.sender.userId == activeProfileId ? 'sender-bubble' : 'receiver-bubble';
    messageCard.appendChild(messageType);

    const messageContent = document.createElement('span');
    messageContent.innerText = message.content;
    messageType.appendChild(messageContent);

    container.appendChild(messageCard);
}

async function populateChatParticipants(id) {
    const messageChatsParticipants = document.getElementById('message-chats-participants');
    const users = await fetchChatUsers(id);
    const userProfiles = users.__participants__;

    messageChatsParticipants.innerHTML = '';
    userProfiles.forEach(profile => createChatParticipantCard(profile, messageChatsParticipants));
}

function createChatParticipantCard(profile, container) {
    const messageChatParticipant = document.createElement('div');
    messageChatParticipant.className = 'message-chat-participant';

    const participantImage = document.createElement('img');
    participantImage.src = profile.profile.profileImageURL;
    messageChatParticipant.appendChild(participantImage);

    const participantName = document.createElement('span');
    participantName.innerText = profile.name;
    messageChatParticipant.appendChild(participantName);

    container.appendChild(messageChatParticipant);
}

async function createDevModeProfilePicker(users) {
    const devProfilePicker = document.getElementById('user-profile-select');
    devProfilePicker.innerHTML = ''; // Clear previous options
    document.getElementById('message-chats-bounds').innerHTML = '';

    users.forEach((user, index) => {
        const option = document.createElement('option');
        option.value = user.userId;
        option.innerText = user.name;
        if (index === 0) option.selected = true;
        devProfilePicker.appendChild(option);
    });

    populateChats();
}

async function sendMessage() {
    const chatId = document.getElementById('message-chats-bounds').getAttribute('chatid');
    const activeProfile = Number(document.getElementById('user-profile-select').value);
    const content = document.getElementById('chats-send-content');

    if (!chatId || isNaN(activeProfile) || content.value.trim() === '') return;

    try {
        const response = await fetch(`${apiUrl}/chat/${chatId}/messages/create`, {
            method: "POST",
            body: JSON.stringify({ sender: activeProfile, content: content.value }),
            headers: { "Content-Type": "application/json" }
        });
        if (!response.ok) throw new Error('Network response was not ok');
    } catch (error) {
        console.error('Error sending message:', error);
        return;
    }

    content.value = ''; // Clear input
    populateChatMessages(chatId);
}

function clickCreateUser() {
    document.getElementById('user-create-dialog').showModal();
}

async function clickCreateChat() {
    document.getElementById('chat-create-dialog').showModal();
    const chatCreateUsers = document.getElementById('chat-create-users');
    chatCreateUsers.innerHTML = '';

    const users = await fetchUsers();
    users.forEach((user, index) => {
        const option = document.createElement('option');
        option.value = user.userId;
        option.innerText = user.name;
        if (index === 0) option.selected = true;
        chatCreateUsers.appendChild(option);
    });
}

async function createUser() {
    const username = document.getElementById('user-create-name').value;
    const dialog = document.getElementById('user-create-dialog');

    if (username.trim() === '') return;

    try {
        const response = await fetch(`${apiUrl}/users/create`, {
            method: "POST",
            body: JSON.stringify({ name: username }),
            headers: { "Content-Type": "application/json" }
        });
        if (!response.ok) throw new Error('Network response was not ok');
    } catch (error) {
        console.error('Error creating user:', error);
        return;
    }

    dialog.close();
    createDevModeProfilePicker(await fetchUsers());
}

async function createChat() {
    const name = document.getElementById('chat-create-name').value;
    const dialog = document.getElementById('chat-create-dialog');
    const usersSelect = document.getElementById('chat-create-users');
    const selectedUsers = Array.from(usersSelect.selectedOptions).map(option => ({ id: parseInt(option.value) }));

    if (name.trim() === '') return;

    try {
        const response = await fetch(`${apiUrl}/chat/create`, {
            method: "POST",
            body: JSON.stringify({ name, participants: selectedUsers }),
            headers: { "Content-Type": "application/json" }
        });
        if (!response.ok) throw new Error('Network response was not ok');
    } catch (error) {
        console.error('Error creating chat:', error);
        return;
    }

    dialog.close();
    populateChats();
}

document.addEventListener('DOMContentLoaded', async () => {
    const users = await fetchUsers();
    createDevModeProfilePicker(users);
});
