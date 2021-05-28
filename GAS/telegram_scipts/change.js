/**
 * Изменяет значение одной ячейки таблицы "tempAction"
 *
 * @param chatID ID чата пользователя, по корому нужн фильтровать строки таблицы
 * @param cell Номер стоблца
 * @param value Изменяемое значение
 */
function insertIntoCell(chatID, cell, value) {
    let ss = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/10dU6RSG2lRQ9lDjMEXTSgdBMPjjB6FFID6WFSsYz3PU/edit#gid=0');
    let sheet = ss.getSheetByName('tempAction');
    // получаем список всех chatID
    const reviewIds = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues().map(r => r[0].toString().toLowerCase());
    // получаем позицию полученного chatID из запроса в списке reviewIds
    const posIndex = reviewIds.indexOf(chatID.toString().toLowerCase());
    // Находим строку в таблице с найденной позицией
    const rowNumber = posIndex + 2;
    sheet.getRange(rowNumber, cell, 1, 1).setValue(value);
}

/**
 * Читает значение одной ячейки таблицы "tempAction"
 *
 * @param chatID
 * @param cell
 * @returns {string}
 */
function readCell(chatID, cell) {
    let ss = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/10dU6RSG2lRQ9lDjMEXTSgdBMPjjB6FFID6WFSsYz3PU/edit#gid=0');
    let sheet = ss.getSheetByName('tempAction');
    // получаем список всех chatID
    const reviewIds = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues().map(r => r[0].toString().toLowerCase());
    // получаем позицию полученного chatID из запроса в списке reviewIds
    const posIndex = reviewIds.indexOf(chatID.toString().toLowerCase());
    // Находим строку в таблице с найденной позицией
    const rowNumber = posIndex + 2;
    return sheet.getRange(rowNumber, cell, 1, 1).getValue();
}

/**
 * Возращает все отзывы в данной категории от польователя с установленным chatID
 *
 * @param chatID
 * @param category
 * @returns {[]}
 */
function searchReviewsByCategoryChatID(chatID, category) {
    let ssEmail = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/10dU6RSG2lRQ9lDjMEXTSgdBMPjjB6FFID6WFSsYz3PU/edit#gid=0');
    let sheetEmail = ssEmail.getSheetByName('email');
    let email = searchEmailByChatID(chatID, sheetEmail);
    let ss = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1vw0Vtf1D8VIAvacZnXsXA3enVVmJbC0I-WePkan_L6g/edit#gid=0');
    let sheet = ss.getSheetByName(category);
    let sheet_range = sheet.getDataRange();
    let sheetValues = sheet_range.getValues();
    let searchReviewsByCategoryChatID = []
    sheetValues.filter(function (row) {
        if (row[8] == email) {
            searchReviewsByCategoryChatID.push(row)
        }
    });
    return searchReviewsByCategoryChatID;
}


/**
 * Возвращает строку отзыва, исходя из его ID
 *
 * @param id
 * @param category
 * @returns {*}
 */
function getMissingData(id, category) {
    let ss = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1vw0Vtf1D8VIAvacZnXsXA3enVVmJbC0I-WePkan_L6g/edit#gid=0');
    let sheet = ss.getSheetByName(category);
    let sheet_range = sheet.getDataRange();
    let sheetValues = sheet_range.getValues();
    let searchReviewsByCategoryChatID;
    sheetValues.filter(function (row) {
        if (row[0] == id) {
            searchReviewsByCategoryChatID = row;
        }
    });
    return searchReviewsByCategoryChatID;
}

/**
 * Отправляет данные для изменения существующего отзыва на url основного скрипта
 *
 * @param chatID
 * @returns {*|Promise<Response>}
 */
function sendDataToChangeUser(chatID) {
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
    let dateNow = Date.now();
    let email = searchEmailByChatID(chatID, sheetEmail);

    let creators;
    if (values[0] == 'film') {
        creators = 'directors';
    } else if (values[0] == 'book') {
        creators = 'authors';
    } else {
        creators = 'developers';
    }
    let url = `${urlTableReviewr}?userEmail=${email}&${creators}=${values[3]}&category=${values[0]}&change=true&year=${values[4]}&genre=${values[5]}&rating=${values[6]}&description=${values[8]}&creationDate=${dateNow}&title=${values[1]}&id=${values[9]}&localTitle=${values[2]}&viewed=${values[7]}`

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
function changeReviewrByCategory(category, message, text) {
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
            incrementStep(chatID, step + 1, 'Change text');
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
            insertIntoCell(chatID, 13, text);
            payload = {
                chat_id: message.message.chat.id,
                text: 'Подготавливаем данные. Это займет пару секунд...'
            }
            sendMessage(payload);
            let category = readCell(chatID, 4);
            let listVlaues = getMissingData(text, category);
            insertIntoCell(chatID, 5, listVlaues[1]);
            insertIntoCell(chatID, 6, listVlaues[9]);
            insertIntoCell(chatID, 7, listVlaues[2]);
            insertIntoCell(chatID, 8, listVlaues[3]);
            insertIntoCell(chatID, 9, listVlaues[4]);
            insertIntoCell(chatID, 11, listVlaues[10]);

            incrementStep(chatID, step + 1);
            payload = {
                chat_id: message.message.chat.id,
                text: 'Введите новый рейтинг (от 1 до 10): '
            }
        } else {
            payload = {
                chat_id: message.message.chat.id,
                text: 'Неверный ID отзыва! Введите еще раз:'
            }
        }
        sendMessage(payload);

    }

    if (step == 3) {
        if (+text >= 1 && +text <= 10) {
            insertIntoCell(chatID, 10, text);
            incrementStep(chatID, step + 1);
            payload = {
                chat_id: message.message.chat.id,
                text: 'Введите отзыв: '
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

    if (step == 4) {
        payload = {
            chat_id: message.message.chat.id,
            text: 'Изменяем...'
        }
        sendMessage(payload);
        insertIntoCell(chatID, 12, text);

        sendDataToChangeUser(chatID);
        deleteActionByChatID(message);
        payload = {
            chat_id: message.message.chat.id,
            text: 'Спасибо! Отзыв изменен!'
        }
        sendMessage(payload);

    }

}
