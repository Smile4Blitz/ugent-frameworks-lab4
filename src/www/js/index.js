const apiUrl = `${window.location.origin}`;

async function fetchUsers() {
    try {
        const response = await fetch(apiUrl + '/users');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

async function fetchChats(id) {
    console.log('url:' + apiUrl + '/users/' + id + '/chats');
    try {
        const response = await fetch(apiUrl + '/users/' + id + '/chats');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching chats:', error);
    }
}

async function populateChats() {
    const messageUsersDiv = document.getElementById('message-users-bounds');
    const activeProfile = document.getElementById('user-profile-select');
    document.getElementById('message-chats-bounds').innerHTML = '';
    messageUsersDiv.innerHTML = '';

    const chats = await fetchChats(activeProfile.value);

    chats.forEach(chat => {
        const chatCard = document.createElement('div');
        chatCard.className = 'user-card';

        // user profile image
        const chatImage = document.createElement('div');
        chatImage.className = 'user-image';
        chatCard.appendChild(chatImage);

        const userImg = document.createElement('img');
        userImg.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXJA32WU4rBpx7maglqeEtt3ot1tPIRWptxA&s"; // placeholder
        userImg.alt = "profile image";
        chatImage.appendChild(userImg);

        // chatName
        const chatName = document.createElement('div');
        chatName.className = 'user-name';
        chatCard.appendChild(chatName);

        const chatNameSpan = document.createElement('span');
        chatNameSpan.innerText = chat.name; // chatName from REST-response
        chatName.appendChild(chatNameSpan)

        chatCard.addEventListener('click', () => populateChatMessages(chat.chatId));

        messageUsersDiv.appendChild(chatCard);
    });
}

async function fetchChatMessages(id) {
    try {
        const response = await fetch(apiUrl + '/chat/' + id + '/messages');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching chat messages:', error);
    }
}

async function populateChatMessages(id) {
    const chatMessageBlock = document.getElementById('message-chats-bounds');
    const activeProfile = document.getElementById('user-profile-select');
    chatMessageBlock.innerHTML = '';

    const messages = await fetchChatMessages(id);
    chatMessageBlock.setAttribute('chatid', id);

    messages.forEach(message => {
        const messageCard = document.createElement('div');
        messageCard.className = 'message-card';

        const messageType = document.createElement('div');
        if (message.sender.userId == activeProfile.value)
            messageType.className = 'sender-bubble';
        else
            messageType.className = 'receiver-bubble'
        messageCard.appendChild(messageType);

        const messageContent = document.createElement('span');
        messageContent.innerText = message.content;
        messageType.appendChild(messageContent);

        chatMessageBlock.appendChild(messageCard);
    });
}

async function createDevModeProfilePicker(users) {
    const dev_profile_picker = document.getElementById('user-profile-select');
    document.getElementById('message-chats-bounds').innerHTML = '';
    dev_profile_picker.innerHTML = '';

    users.forEach((user, index) => {
        const option = document.createElement('option');
        option.value = user.userId;
        option.innerText = user.name;

        if (index === 0)
            option.selected = true;

        dev_profile_picker.appendChild(option);
    });

    populateChats(dev_profile_picker);
}

async function sendMessage() {
    const chatid = document.getElementById('message-chats-bounds').getAttribute('chatid');
    const activeProfile = Number(document.getElementById('user-profile-select').value).valueOf();
    const content = document.getElementById('chats-send-content');
    
    if (chatid == null || isNaN(activeProfile) || content == '')
        return;

    try {
        const response = await fetch(apiUrl + '/chat/' + chatid + '/messages/create', {
            method: "POST",
            body: JSON.stringify({
                sender: activeProfile,
                content: content.value
            }),
            headers : {
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
    } catch (error) {
        console.error('Error fetching users:', error);
        return;
    }

    content.value = '';

    populateChatMessages(chatid);
}

document.addEventListener('DOMContentLoaded', async () => {
    const users = await fetchUsers();
    createDevModeProfilePicker(users);
});
