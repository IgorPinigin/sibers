import { db } from "../firebase";
import {
  ref,
  push,
  set,
  update,
  query,
  orderByChild,
  equalTo,
  get,
  onValue,
  remove
} from "firebase/database";

export const sendMessage = async (chatId, authorId, photoUrl, text) => {
  const messagesRef = ref(db, `messages/${chatId}`);
  const newMessageRef = push(messagesRef);
  await set(newMessageRef, {
    date: Date.now(),
    authorId,
    photoUrl,
    text,
  });
};

export const createChat = async (owner, name, userIds) => {
  const chatRef = ref(db, `chats/`);
  const newChatRef = push(chatRef);
  const chatId = newChatRef.key;
  const uid = owner.uid;
  await set(newChatRef, {
    ownerId: uid,
    name,
    users: userIds.reduce((acc, userId) => ({ ...acc, [userId]: false }), {}),
    createdAt: Date.now(),
  });
  const updates = {};
  userIds.forEach((userId) => {
    updates[`userChats/${userId}/${chatId}`] = false;
  });

  await update(ref(db), updates);

  const messagesRef = ref(db, `messages/${chatId}`);
  const newMessageRef = push(messagesRef);
  await set(newMessageRef, {
    date: Date.now(),
    authorId: "admin",
    text: `Пользователь ${owner.email} создал чат ${name}`,
  });

  return chatId;
};

export const getAdminChats = async (id) => {
  const chatsRef = ref(db, "chats");
  const ownedChatsQuery = query(chatsRef, orderByChild("ownerId"), equalTo(id));

  const snapshot = await get(ownedChatsQuery);
  if (snapshot.exists()) {
    return Object.entries(snapshot.val()).map(([chatId, chatData]) => ({
      chatId,
      ...chatData,
    }));
  } else {
    return [];
  }
};

export const getAllUsers = async (currentUserId) => {
  try {
    const usersRef = ref(db, "users");
    const snapshot = await get(usersRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.entries(data)
        .filter(([userId]) => userId !== currentUserId)
        .map(([userId, userData]) => ({
          uid: userId,
          ...userData,
        }));
    } else {
      return [];
    }
  } catch (error) {
    console.error("", error);
    return [];
  }
};

export const getChatsForUser = async (userId) => {
  try {
    const userChatsRef = ref(db, `userChats/${userId}`);
    const userChatsSnapshot = await get(userChatsRef);

    if (!userChatsSnapshot.exists()) {
      return [];
    }

    const userChatsData = userChatsSnapshot.val();
    const chatIds = Object.keys(userChatsData);
    const chatPromises = chatIds.map(async (chatId) => {
      const chatRef = ref(db, `chats/${chatId}`);
      const chatSnapshot = await get(chatRef);
      if (chatSnapshot.exists()) {
        return {
          chatId,
          ...chatSnapshot.val(),
        };
      } else {
        return null;
      }
    });
    const chatsData = await Promise.all(chatPromises);
    return chatsData.filter(Boolean);
  } catch (error) {
    console.error("", error);
    throw error;
  }
};

export const getChatMessages = async (chatId) => {
  try {
    const messagesRef = ref(db, `messages/${chatId}`)
    const snapshot = await get(messagesRef)
    if (snapshot.exists()) {
      const data = snapshot.val()
      const messages = Object.entries(data).map(([msgId, msgData]) => ({
        msgId,
        ...msgData
      }))
      return messages
    } else {
      return []
    }
  } catch (error) {
    console.error('', error)
    throw error
  }
}

export const subscribeToChatMessages = (chatId, callback) => {
  const messagesRef = ref(db, `messages/${chatId}`)

  const unsubscribe = onValue(messagesRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val()
      const messages = Object.entries(data).map(([msgId, msgData]) => ({
        msgId,
        ...msgData
      }))
      callback(messages)
    } else {
      callback([])
    }
  })
  return unsubscribe
}

export const setUserInChatToTrue = async (chatId, userId) => {
  try {
    const updates = {}
    updates[`chats/${chatId}/users/${userId}`] = true
    await update(ref(db), updates)
  } catch (error) {
    console.error('', error)
  }
}

export const removeUserFromChat = async (chatId, userId) => {
  try {
    const userRefInChat = ref(db, `chats/${chatId}/users/${userId}`)
    await remove(userRefInChat)
  } catch (error) {
    console.error('', error)
  }
}

export const getChatById = async (chatId) => {
  try {
    const chatRef = ref(db, `chats/${chatId}`)
    const snapshot = await get(chatRef)
    if (snapshot.exists()) {
      return {
        chatId,
        ...snapshot.val(),
      }
    } else {
      return null
    }
  } catch (error) {
    console.error('', error)
    throw error
  }
}

export const getChatUsersByStatus = async (chatId) => {
  try {
    const chatRef = ref(db, `chats/${chatId}`)
    const chatSnap = await get(chatRef)

    if (!chatSnap.exists()) {
      return {
        owner: null,
        trueUsers: [],
        falseUsers: []
      }
    }
    const chatData = chatSnap.val()
    const ownerId = chatData.ownerId
    let owner = null
    if (ownerId) {
      const ownerRef = ref(db, `users/${ownerId}`)
      const ownerSnap = await get(ownerRef)
      if (ownerSnap.exists()) {
        owner = { uid: ownerId, ...ownerSnap.val() }
      }
    }
    if (!chatData.users) {
      return {
        owner,
        trueUsers: [],
        falseUsers: []
      }
    }
    const userEntries = Object.entries(chatData.users)
    const userPromises = userEntries.map(async ([userId, value]) => {
      const userRef = ref(db, `users/${userId}`)
      const userSnap = await get(userRef)
      if (userSnap.exists()) {
        return {
          uid: userId,
          status: value,
          ...userSnap.val()
        }
      } else {
        return null
      }
    })

    const rawUsers = await Promise.all(userPromises)
    const filtered = rawUsers.filter(Boolean)
    const trueUsers = filtered.filter(u => u.status === true)
    const falseUsers = filtered.filter(u => u.status === false)

    return {
      owner,
      trueUsers,  
      falseUsers   
    }

  } catch (error) {
    console.error('', error)
    throw error
  }
}