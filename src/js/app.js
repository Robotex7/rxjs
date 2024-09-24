import { interval } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import { of } from 'rxjs';

// URL для опроса сервера
const URL = 'http://localhost:3000/messages/unread';

// Элемент таблицы для вывода сообщений
const messageTable = document.getElementById('message-table');

// Функция для преобразования timestamp в формат ЧЧ:ММ ДД.ММ.ГГГГ
function formatDate(timestamp) {
  const date = new Date(timestamp * 1000);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${hours}:${minutes} ${day}.${month}.${year}`;
}

// Функция для добавления сообщений в таблицу
function addMessagesToTable(messages) {
  messages.forEach(message => {
    const row = document.createElement('tr');

    // Короткий заголовок с ограничением в 15 символов
    const shortSubject = message.subject.length > 15 ? message.subject.slice(0, 15) + '...' : message.subject;

    row.innerHTML = `
      <td>${message.from}</td>
      <td>${shortSubject}</td>
      <td>${message.body}</td>
      <td>${formatDate(message.received)}</td>
    `;
    // Добавляем новое сообщение в начало таблицы
    messageTable.prepend(row);
  });
}

// Периодический опрос сервера каждые 5 секунд
interval(5000)
  .pipe(
    switchMap(() => ajax.getJSON(URL)),
    catchError(() => of({ messages: [] })) // Обработка ошибок как отсутствие сообщений
  )
  .subscribe(response => {
    if (response && response.messages && response.messages.length > 0) {
      addMessagesToTable(response.messages);
    }
  });
