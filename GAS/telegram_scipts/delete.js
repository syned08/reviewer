/**
 * Отправляет данные для удаления отзыва на url основного скрипта
 *
 * @param chatID
 * @param id
 * @returns {*|Promise<Response>}
 */
function deleteByReviewByIDandChatID(chatID, id) {
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
    let values = sheet.getRange(rowNumber, 4, 1, 11).getValues()[0];
    let email = searchEmailByChatID(chatID, sheetEmail);
    let url = `${urlTableReviewr}?email=${email}&category=${values[0]}&delete=true&id=${id}`
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
 * @param text
 */
function deleteReviewrByCategory(category, message, text) {
    let chatID = message.message.chat.id;
    let step = getStep(chatID);
    let options = {
        day: 'numeric',
        month: '2-digit',
        year: 'numeric',
        weekday: 'long',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };

    if (step == 1) {
        payload = {
            chat_id: message.message.chat.id,
            text: 'Ищим ваши отзывы...'
        }
        sendMessage(payload);
        insertIntoCell(chatID, 4, category);
        let allReviews = searchReviewsByCategoryChatID(chatID, category);
        let review = 'Выберите ID отзыва для редактирования:\n'
        let listIDs = []
        for (let list in allReviews) {
            review += `ID: ${allReviews[list][0]}\n`;
            listIDs.push(allReviews[list][0]);
            review += `Название: ${allReviews[list][1]}\n`;
            review += `Дата: ${new Date(+allReviews[list][7]).toLocaleDateString("ru-RU", options)}\n\n`;
        }

        if (listIDs.length == 0) {
            deleteActionByChatID(message);
            payload = {
                chat_id: message.message.chat.id,
                text: 'У вас еще нет отзывов в данной категории :(\nЧтобы добавить введите /add'
            }
            sendMessage(payload);
        } else {
            listIDs = JSON.stringify(listIDs);
            incrementStep(chatID, step + 1, 'Delete text');
            insertIntoCell(chatID, 14, listIDs);
            payload = {
                chat_id: message.message.chat.id,
                text: review
            }
            sendMessage(payload);
        }

    }

    if (step == 2) {
        let listIDs = JSON.parse(readCell(chatID, 14));
        if (listIDs.includes(Number(text))) {
            payload = {
                chat_id: message.message.chat.id,
                text: 'Удаляем...'
            }
            sendMessage(payload);
            deleteByReviewByIDandChatID(chatID, text);
            deleteActionByChatID(message);
            payload = {
                chat_id: message.message.chat.id,
                text: 'Отзыв удален!'
            }
            sendMessage(payload);

        } else {
            payload = {
                chat_id: message.message.chat.id,
                text: 'Неверный ID отзыва! Введите еще раз:'
            }
            sendMessage(payload);
        }
    }
}
