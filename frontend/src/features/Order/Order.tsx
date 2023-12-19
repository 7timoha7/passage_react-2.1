import axios from 'axios';
import React from 'react';

const botToken = '6719177853:AAG43TUbzPaH5MtbciFBPse-jhKcvyYw1IQ';
const chatId = '640421282';
let lastRequestTime = 0;
const minInterval = 60000; // 1 минута в миллисекундах

// const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const sendMessageToTelegram = async () => {
  const currentTime = Date.now();

  if (currentTime - lastRequestTime < minInterval) {
    console.log('Слишком частые запросы. Подождите.');
    return;
  }

  const message = 'Новый заказ ожидает обработки!';

  try {
    const response = await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      chat_id: chatId,
      text: message,
    });

    console.log('Message sent to Telegram:', response.data);
  } catch (error) {
    console.error('Error sending message to Telegram:', error);
  } finally {
    lastRequestTime = currentTime;
  }
};

const Order = () => {
  return (
    <div>
      {/* Здесь вы можете разместить свой интерфейс заказа и кнопку для отправки уведомления */}
      <button onClick={sendMessageToTelegram}>Отправить заказ в Telegram</button>
    </div>
  );
};

export default Order;
