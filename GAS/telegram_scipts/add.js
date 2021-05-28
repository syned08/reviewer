// Ссылка на основной скрипт с чтением, добавлением, изменением, удалением данных
const urlTableReviewr = 'https://script.google.com/macros/s/AKfycbyfJJHnYKACmeAUtH9Odn2zYe2HiIHJREZGXVXYaBMCvDNAZeYqu_L1IecgTD28f7klaQ/exec'

/**
 * Получает текущий шаг действия в таблице "tempAction"
 *
 * @param chatID
 * @returns {string} Шаг действия
 */
function getStep(chatID) {
    let ss = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/10dU6RSG2lRQ9lDjMEXTSgdBMPjjB6FFID6WFSsYz3PU/edit#gid=0');
    let sheet = ss.getSheetByName('tempAction');

    let sheet_range = sheet.getDataRange();
    let sheetValues = sheet_range.getValues();
    let step;

    sheetValues.filter(function (row) {
        if (row[0] == chatID) {
            step = row[2];
        }
    });
    return step;
}

/**
 * Инкрементирует шаг действия, исходя из chatID пользователя
 *
 * @param chatID
 * @param incremet Число, на к-е нужно увеличить шаг
 * @param actionText действтие, к-е нужно записать один раз в таблицу
 */
function incrementStep(chatID, incremet, actionText) {
    let ss = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/10dU6RSG2lRQ9lDjMEXTSgdBMPjjB6FFID6WFSsYz3PU/edit#gid=0');
    let sheet = ss.getSheetByName('tempAction');

    // получаем список всех chatID
    const reviewIds = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues().map(r => r[0].toString().toLowerCase());
    // получаем позицию полученного chatID из запроса в списке reviewIds
    const posIndex = reviewIds.indexOf(chatID.toString().toLowerCase());
    // Находим строку в таблице с найденной позицией
    const rowNumber = posIndex + 2;
    sheet.getRange(rowNumber, 3, 1, 1).setValue(incremet);
    if (actionText) {
        sheet.getRange(rowNumber, 2, 1, 1).setValue(actionText);
    }

}

/**
 * Отправляет данные для добавления нового отзыва на url основного скрипта
 *
 * @param chatID
 * @returns {*|Promise<Response>}
 */
function sendDataToAddUser(chatID) {
    let ss = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/10dU6RSG2lRQ9lDjMEXTSgdBMPjjB6FFID6WFSsYz3PU/edit#gid=0');
    let sheet = ss.getSheetByName('tempAction');

    let ssEmail = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/10dU6RSG2lRQ9lDjMEXTSgdBMPjjB6FFID6WFSsYz3PU/edit#gid=0');
    let sheetEmail = ssEmail.getSheetByName('email');
    // получаем список всех chatID
    const reviewIds = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues().map(r => r[0].toString().toLowerCase());
    // получаем позицию полученного chatID из запроса в списке reviewIds
    const posIndex = reviewIds.indexOf(chatID.toString().toLowerCase());
    // Находим строку в таблице с найденной позицией
    const rowNumber = posIndex + 2;
    let values = sheet.getRange(rowNumber, 4, 1, 12).getValues()[0];
    let dateNow = Date.now();
    let email = searchEmailByChatID(chatID, sheetEmail);

    let payload = {}
    payload['category'] = values[0];
    payload['add'] = 'true';
    payload['title'] = values[1];
    let creators;
    if (values[0] == 'film') {
        creators = 'directors';
    } else if (values[0] == 'book') {
        creators = 'authors';
    } else {
        creators = 'developers';
    }

    let url = `${urlTableReviewr}?userEmail=${email}&${creators}=${values[3]}&category=${values[0]}&add=true&year=${values[4]}&genre=${values[5]}&rating=${values[6]}&description=${values[8]}&creationDate=${dateNow}&title=${values[1]}&localTitle=${values[2]}&viewed=${values[7]}`

    let options = {
        'method': 'post'
    }
    return UrlFetchApp.fetch(url, options);
}

/**
 * Реализовывает поэтапный опрос пользователя исодя из текущего шага в таблице "tempAction"
 *
 * @param category
 * @param message
 * @param text Данные, к-е пришли от пользователя (что написал в чате)
 */
function addReviewrByCategory(category, message, text) {
    let chatID = message.message.chat.id;
    let step = getStep(chatID);

    if (step == 1) {
        insertIntoCell(chatID, 4, category);
        incrementStep(chatID, step + 1, actionText = 'Add text');
        payload = {
            chat_id: message.message.chat.id,
            text: 'Введите название: '
        }
        sendMessage(payload);
    }
    if (step == 2) {
        insertIntoCell(chatID, 5, text);
        incrementStep(chatID, step + 1);
        payload = {
            chat_id: message.message.chat.id,
            text: 'Введите локализованное название (чтобы пропустить введите 0): '
        }
        sendMessage(payload);
    }
    if (step == 3) {
        if (text == '0') {
            text = '';
        }
        insertIntoCell(chatID, 6, text);
        incrementStep(chatID, step + 1);
        payload = {
            chat_id: message.message.chat.id,
            text: 'Введите создателей (фильма, книги, игры). Чтобы пропустить введите 0: '
        }
        sendMessage(payload);
    }
    if (step == 4) {
        if (text == '0') {
            text = '';
        }
        insertIntoCell(chatID, 7, text);
        incrementStep(chatID, step + 1);
        payload = {
            chat_id: message.message.chat.id,
            text: 'Введите год: '
        }
        sendMessage(payload);
    }
    if (step == 5) {
        let year = new Date().getFullYear();
        if (+text <= year) {
            insertIntoCell(chatID, 8, text);
            incrementStep(chatID, step + 1);
            payload = {
                chat_id: message.message.chat.id,
                text: 'Введите жанр. Чтобы пропустить введите 0:'
            }
            sendMessage(payload);
        } else {
            payload = {
                chat_id: message.message.chat.id,
                text: 'Введите верный год! '
            }
            sendMessage(payload);
        }
    }

    if (step == 6) {
        if (text == '0') {
            text = '';
        }
        insertIntoCell(chatID, 9, text);
        incrementStep(chatID, step + 1);
        payload = {
            chat_id: message.message.chat.id,
            text: 'Введите рейтинг (от 1 до 10): '
        }
        sendMessage(payload);
    }

    if (step == 7) {
        if (+text >= 1 && +text <= 10) {
            insertIntoCell(chatID, 10, text);
            incrementStep(chatID, step + 1);
            payload = {
                chat_id: message.message.chat.id,
                text: 'Это повторное ознакомление?\n1. Да\n2. Нет'
            }
            sendMessage(payload);
        } else {
            payload = {
                chat_id: message.message.chat.id,
                text: 'Введите верное число! '
            }
            sendMessage(payload);
        }
    }

    if (step == 8) {
        if (+text >= 1 && +text <= 2) {
            if (text == 1) {
                text = 'true';
            } else {
                text = 'false';
            }
            insertIntoCell(chatID, 11, text);
            incrementStep(chatID, step + 1);
            payload = {
                chat_id: message.message.chat.id,
                text: 'Введите отзыв:'
            }
            sendMessage(payload);
        } else {
            payload = {
                chat_id: message.message.chat.id,
                text: 'Введите верное число! '
            }
            sendMessage(payload);
        }
    }

    if (step == 9) {
        payload = {
            chat_id: message.message.chat.id,
            text: 'Добавляем...'
        }
        sendMessage(payload);
        insertIntoCell(chatID, 12, text);
        sendDataToAddUser(chatID);
        deleteActionByChatID(message);

        payload = {
            chat_id: message.message.chat.id,
            text: 'Спасибо! Отзыв добавлен!'
        }
        sendMessage(payload);
    }

}
