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
  onValue
} from "firebase/database";

export const sendMessage = async (chatId, authorId, text) => {
  const messagesRef = ref(db, `messages/${chatId}`);
  const newMessageRef = push(messagesRef);
  await set(newMessageRef, {
    date: Date.now(),
    authorId,
    text,
  });
};

export const createChat = async (owner, name, userIds) => {
  const chatRef = ref(db, `chats/`);
  const newChatRef = push(chatRef);
  const chatId = newChatRef.key;
  const uid = owner.uid;
  // Создаём чат
  await set(newChatRef, {
    ownerId: uid,
    name,
    users: userIds.reduce((acc, userId) => ({ ...acc, [userId]: false }), {}),
    createdAt: Date.now(),
  });

  // Обновляем userChats для каждого участника
  const updates = {};
  userIds.forEach((userId) => {
    updates[`userChats/${userId}/${chatId}`] = false;
  });

  await update(ref(db), updates);

  const messagesRef = ref(db, `messages/${chatId}`);
  const newMessageRef = push(messagesRef);
  await set(newMessageRef, {
    date: Date.now(),
    author: "admin",
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
      // Все пользователи в виде объекта { userId: userData }
      const data = snapshot.val();
      // Преобразуем объект в массив, исключая текущего пользователя
      return Object.entries(data)
        .filter(([userId]) => userId !== currentUserId) // Исключаем userId === currentUserId
        .map(([userId, userData]) => ({
          uid: userId,
          ...userData,
        }));
    } else {
      return [];
    }
  } catch (error) {
    console.error("Ошибка при получении пользователей:", error);
    return [];
  }
};

export const getChatsForUser = async (userId) => {
  try {
    // 1. Берём список чатов из ветки userChats/{userId}
    const userChatsRef = ref(db, `userChats/${userId}`);
    const userChatsSnapshot = await get(userChatsRef);

    if (!userChatsSnapshot.exists()) {
      return [];
    }

    const userChatsData = userChatsSnapshot.val();

    // 2. Массив chatIds:
    const chatIds = Object.keys(userChatsData);

    // 3. Сходим в /chats/{chatId} за данными каждого чата
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

    // Ждём все промисы и фильтруем null
    const chatsData = await Promise.all(chatPromises);
    return chatsData.filter(Boolean);
  } catch (error) {
    console.error("Ошибка при получении чатов пользователя:", error);
    throw error;
  }
};

export const getChatMessages = async (chatId) => {
  try {
    const messagesRef = ref(db, `messages/${chatId}`)
    const snapshot = await get(messagesRef)
    if (snapshot.exists()) {
      const data = snapshot.val()
      // Превращаем объект вида { msgId: {...}, ...} в массив
      const messages = Object.entries(data).map(([msgId, msgData]) => ({
        msgId,
        ...msgData
      }))
      // При необходимости можно отсортировать по дате
      // messages.sort((a, b) => a.date - b.date)
      return messages
    } else {
      return []
    }
  } catch (error) {
    console.error('Ошибка при получении сообщений:', error)
    throw error
  }
}

export const subscribeToChatMessages = (chatId, callback) => {
  const messagesRef = ref(db, `messages/${chatId}`)

  // Метод onValue будет вызываться при каждом изменении данных в messages/{chatId}
  const unsubscribe = onValue(messagesRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val()
      // Преобразуем объект с ключами в массив
      const messages = Object.entries(data).map(([msgId, msgData]) => ({
        msgId,
        ...msgData
      }))
      // При необходимости можно отсортировать по дате
      // messages.sort((a, b) => a.date - b.date)
      callback(messages)
    } else {
      // Если нет сообщений, возвращаем пустой массив
      callback([])
    }
  })

  // Возвращаем функцию, которую можно вызвать, чтобы отписаться от обновлений
  return unsubscribe
}