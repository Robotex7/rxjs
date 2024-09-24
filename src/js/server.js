const express = require('express');
const faker = require('faker');
const app = express();
const port = 3000;

// Функция генерации случайных сообщений
function generateMessages() {
  return Array.from({ length: faker.datatype.number({ min: 1, max: 5 }) }, () => ({
    id: faker.datatype.uuid(),
    from: faker.internet.email(),
    subject: faker.lorem.sentence(3),
    body: faker.lorem.paragraph(),
    received: Math.floor(Date.now() / 1000) - faker.datatype.number({ min: 1000, max: 100000 })
  }));
}

app.get('/messages/unread', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: Math.floor(Date.now() / 1000),
    messages: generateMessages(),
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
