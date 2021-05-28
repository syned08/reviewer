const token = 'TOKEN';
const tgBotUrl = 'https://api.telegram.org/bot' + token;
const hookUrl = 'https://link/exec';

/**
 * Устанавливает вебхук.
 * При работе бота на вебхуках сервер телеграмма сам обращается к нашему боту когда есть новые данные.
 */
function setWebHook() {
    let response = UrlFetchApp.fetch(tgBotUrl + "/setWebhook?url=" + hookUrl);
    Logger.log('Telegram response status is ' + response.getResponseCode());
}

/**
 * Получает от телеграмма текущее значение вебхука
 */
function getWebHook() {
    let response = UrlFetchApp.fetch(tgBotUrl + "/getWebhookInfo");
    if (response.getResponseCode() == 200) {
        let data = JSON.parse(response.getContentText())
        Logger.log('current webhook url is ' + data.result.url);
    } else {
        Logger.log('telegram response status is ' + response.getResponseCode());
    }
}


/**
 * Отправляет сообщение пользователю
 *
 * @param payload Словарь c chatID и сообщением, к-е нужно отправить
 * @returns {*|Promise<Response>}  Отправляет запрос на сервера телеграмма
 */
function sendMessage(payload) {
    let options = {
        'method': 'post',
        'contentType': 'application/json',
        'payload': JSON.stringify(payload)
    }
    return UrlFetchApp.fetch(tgBotUrl + "/sendMessage", options);
}


/**
 * Добавляет нового пользователя в таблицу "email", к-й ввел свою почту
 *
 * @param message Содержимое, к-е приходит от пользователя при определенном POST-запросе
 */
function addNewUserToTable(message) {
    let file = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/10dU6RSG2lRQ9lDjMEXTSgdBMPjjB6FFID6WFSsYz3PU/edit#gid=0');
    let sheet = file.getSheetByName('email');
    let lastRow = sheet.getLastRow() + 1;

    sheet.setActiveSelection('A' + lastRow).setValue(message.message.chat.id);
    sheet.setActiveSelection('B' + lastRow).setValue(message.message.text);
}

/**
 * Записывает в таблицу "tempAction" текущее действие пользователя, исходя из того, какую он ввел команду
 *
 * @param message Содержимое, к-е приходит от пользователя при определенном POST-запросе
 * @param {string} action Действие, к-е нужно записать в таблицу
 */
function createAction(message, action) {
    let file = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/10dU6RSG2lRQ9lDjMEXTSgdBMPjjB6FFID6WFSsYz3PU/edit#gid=0');
    let sheet = file.getSheetByName('tempAction');
    let lastRow = sheet.getLastRow() + 1;

    sheet.setActiveSelection('A' + lastRow).setValue(message.message.chat.id);
    sheet.setActiveSelection('B' + lastRow).setValue(action);
    if (action === 'Add') {
        sheet.setActiveSelection('C' + lastRow).setValue('1');
    }

    if (action === 'Change') {
        sheet.setActiveSelection('C' + lastRow).setValue('1');
        sheet.setActiveSelection('D' + lastRow).setValue('None');
        sheet.setActiveSelection('E' + lastRow).setValue('None');
        sheet.setActiveSelection('F' + lastRow).setValue('None');
        sheet.setActiveSelection('G' + lastRow).setValue('None');
        sheet.setActiveSelection('H' + lastRow).setValue('None');
        sheet.setActiveSelection('I' + lastRow).setValue('None');
        sheet.setActiveSelection('J' + lastRow).setValue('None');
        sheet.setActiveSelection('K' + lastRow).setValue('None');
    }

    if (action === 'Delete') {
        sheet.setActiveSelection('C' + lastRow).setValue('1');
    }

}

/**
 * Удаление текущего действие из таблицы "tempAction"
 *
 * @param message Содержимое, к-е приходит от пользователя при определенном POST-запросе
 */
function deleteActionByChatID(message) {
    const chatID = message.message.chat.id;
    const file = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/10dU6RSG2lRQ9lDjMEXTSgdBMPjjB6FFID6WFSsYz3PU/edit#gid=0');
    const sheet = file.getSheetByName('tempAction');
    const allChatID = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues().map(r => r[0].toString().toLowerCase());
    const posIndex = allChatID.indexOf(chatID.toString().toLowerCase());
    const rowNumber = posIndex + 2;
    sheet.deleteRow(rowNumber);

}

/**
 * Проверка на валидность почты
 *
 * @param {string} email Почта, введеная пользователем
 * @returns {boolean} True or False в зависимости от корректности введеной электронной почты
 */
function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}


/**
 * Поиск текущего действия в таблцие "tempAction" и вызов специфических ф-й, исходя из специфики действия
 *
 * @param message Содержимое, к-е приходит от пользователя при определенном POST-запросе
 */
function searchAction(message) {
    const chatID = message.message.chat.id;
    const file = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/10dU6RSG2lRQ9lDjMEXTSgdBMPjjB6FFID6WFSsYz3PU/edit#gid=0');
    const sheet = file.getSheetByName('tempAction');

    let sheet_range = sheet.getDataRange();
    let sheetValues = sheet_range.getValues();

    // Получем текущее значение "действия" сравнивая по chatID пользовтеля
    let action;
    sheetValues.filter(function (row) {
        if (row[0] === chatID) {
            action = row[1];
        }
    });

    if (action === 'Add email') {
        if (validateEmail(message.message.text)) {
            addNewUserToTable(message);
            payload = {
                chat_id: message.message.chat.id,
                text: 'Добро пожаловать в телеграмм-бот "Рецензент"!\nСуществует несколько команд для взаимодействия с ботом:\n1. Команда /add — служит для добавления отзыва в определенную категорию;\n2. Команда /change — может помочь с редактированием уже существующих отзывов;\n3. Команда /delete — удаляет выбранный отзыв;\n4. Команда /me — позволяет прочесть личные отзывы пользователя выбранной категории;\n5. Команда /category — представляет все отзывы в выбранной категории.\n\nЧтобы изменить текущую почту введите команду /deleteEmail, затем /start'
            }
            sendMessage(payload);

            payload = {
                chat_id: message.message.chat.id,
                text: 'Спасибо! Почта сохранена!\nЧтобы удалить текущую почту введите команду /deleteEmail'
            }
            deleteActionByChatID(message);
            sendMessage(payload)
        } else {
            payload = {
                chat_id: message.message.chat.id,
                text: 'Введите корректный адрес электронной почты!'
            }
            sendMessage(payload);
        }
    }

    if (action === 'Category') {
        let text = message.message.text;
        if (text === "1" || text === "2" || text === "3") {
            let category;
            if (text === "1") {
                category = "film";
            } else if (text === "2") {
                category = "book";
            } else {
                category = "game";
            }

            readReviewByCategory(category, message, action);
            deleteActionByChatID(message)

        } else {
            payload = {
                chat_id: message.message.chat.id,
                text: 'Введите цифру от 1 до 3!'
            }
            sendMessage(payload);
        }
    }

    if (action === 'My category') {
        let text = message.message.text;
        if (text === "1" || text === "2" || text === "3") {
            let category;
            if (text === "1") {
                category = "film";
            } else if (text === "2") {
                category = "book";
            } else {
                category = "game";
            }

            readReviewByCategory(category, message, action);
            deleteActionByChatID(message)
        } else {
            payload = {
                chat_id: message.message.chat.id,
                text: 'Введите цифру от 1 до 3!'
            }
            sendMessage(payload);
        }
    }

    if (action == 'Add') {
        let text = message.message.text;
        if (text === "1" || text === "2" || text === "3") {
            let category;
            if (text === "1") {
                category = "film";
            } else if (text === "2") {
                category = "book";
            } else {
                category = "game";
            }
            addReviewrByCategory(category, message, text);
        } else {
            payload = {
                chat_id: message.message.chat.id,
                text: 'Введите цифру от 1 до 3!'
            }
            sendMessage(payload);
        }
    }

    if (action == 'Add text') {
        let text = message.message.text;
        category = false;
        addReviewrByCategory(category, message, text);
    }

    if (action == 'Change') {
        let text = message.message.text;
        if (text === "1" || text === "2" || text === "3") {
            let category;
            if (text === "1") {
                category = "film";
            } else if (text === "2") {
                category = "book";
            } else if (text === "3") {
                category = "game";
            }
            changeReviewrByCategory(category, message, text);

        } else {
            payload = {
                chat_id: message.message.chat.id,
                text: 'Введите цифру от 1 до 3!'
            }
            sendMessage(payload);
        }
    }

    if (action == 'Change text') {
        let text = message.message.text;
        let category = false;
        changeReviewrByCategory(category, message, text);
    }


    if (action == 'Delete') {
        let text = message.message.text;
        if (text === "1" || text === "2" || text === "3") {
            let category;
            if (text === "1") {
                category = "film";
            } else if (text === "2") {
                category = "book";
            } else if (text === "3") {
                category = "game";
            }
            deleteReviewrByCategory(category, message, text);

        } else {
            payload = {
                chat_id: message.message.chat.id,
                text: 'Введите цифру от 1 до 3!'
            }
            sendMessage(payload);
        }
    }

    if (action == 'Delete text') {
        let text = message.message.text;
        let category = false;
        deleteReviewrByCategory(category, message, text);
    }

}


/**
 * Ищет почту, к-я записана в таблице "email", исходя из chatID пользователя
 * @param chatID
 * @param sheet
 * @returns {string} Почта пользователя
 */
function searchEmailByChatID(chatID, sheet) {
    let sheet_range = sheet.getDataRange();
    let sheetValues = sheet_range.getValues();
    let email;

    sheetValues.filter(function (row) {
        if (row[0] == chatID) {
            email = row[1];
        }
    });
    return email;
}


/**
 * Ищет все отзывы пользователя, исходя из указанной почты
 *
 * @param email
 * @param sheet Таблица категории
 * @returns {string} Форматировання строка с найденными отзывами
 */
function onSearch(email, sheet) {

    let sheet_range = sheet.getDataRange();
    let sheetValue = sheet_range.getValues();


    let all_find_rows = []
    sheetValue.filter(function (row) {
        if (row[8] === email) {
            all_find_rows.push(row)
        }
    });

    let result = '';
    let user;
    for (let sheetValues in all_find_rows) {
        all_find_rows[sheetValues].shift()
        user = '';
        user += `${+sheetValues + 1}. ${all_find_rows[sheetValues][0]}\n`;
        if (all_find_rows[sheetValues][8] == '') {
            user += `Локализованное название: не указано\n`;
        } else {
            user += `Локализованное название: ${all_find_rows[sheetValues][8]}\n`;
        }
        if (all_find_rows[sheetValues][1] != '') {
            user += `${all_find_rows[sheetValues][1]}\n`;
        }
        if (all_find_rows[sheetValues][2] == '') {
            user += `Год: не указан\n`;
        } else {
            user += `Год: ${all_find_rows[sheetValues][2]}\n`;
        }
        if (all_find_rows[sheetValues][3] == '') {
            user += `Жанр: не указан\n`;
        } else {
            user += `Жанр: ${all_find_rows[sheetValues][3]}\n`;
        }
        user += `Рейтинг: ${all_find_rows[sheetValues][4]}/10\n`;
        if (all_find_rows[sheetValues][9].toString().toLowerCase() == 'true') {
            user += `Повторное ознакомление: да\n`;
        } else {
            user += `Повторное ознакомление: нет\n`;
        }
        user += `${all_find_rows[sheetValues][5]}\n`;
        result += user;
        result += '\n\n';
    }

    if (result == "") {
        result = 'У вас нет отзывов в данной категории!';
        return result;
    }
    return result;
}

/**
 * Находит все отзывы в данной категории
 *
 * @param sheet Таблица категории
 * @param allColumnsMovie Название стоблцов таблицы (уникальны для каждой категории)
 * @returns {string[]} Список строк с найденными отзывами
 */
function getData(sheet, allColumnsMovie) {
    let allReviewsList = '';
    sheetRange = sheet.getDataRange();
    sheetValues = sheetRange.getValues();
    // Добавляем все строки талбицы категории в список allReviewsList
    for (var i = 1; i < parseInt(sheetValues.length); i++) {
        let user = '';
        user += `${i}. ${sheetValues[i][1]}\n`;
        if (sheetValues[i][9] == '') {
            user += `Локализованное название: не указано\n`;
        } else {
            user += `Локализованное название: ${sheetValues[i][9]}\n`;
        }

        if (sheetValues[i][2] != '') {
            user += `${sheetValues[i][2]}\n`;
        }
        if (sheetValues[i][3] == '') {
            user += `Год: не указан\n`;
        } else {
            user += `Год: ${sheetValues[i][3]}\n`;
        }
        if (sheetValues[i][4] == '') {
            user += `Жанр: не указан\n`;
        } else {
            user += `Жанр: ${sheetValues[i][4]}\n`;
        }
        user += `Рейтинг: ${sheetValues[i][5]}/10\n`;
        if (sheetValues[i][10].toString().toLowerCase() == 'true') {
            user += `Повторное ознакомление: да\n`;
        } else {
            user += `Повторное ознакомление: нет\n`;
        }
        user += `${sheetValues[i][6]}\n`;

        allReviewsList += user;
        allReviewsList += '\n\n';
    }
    return allReviewsList.split('\n\n\n');
}

/**
 * Обработчик событий, к-й реагирует на запросы получения всех и уникальных для пользователя отзывов в данной категории
 * @param category Текущая категория
 * @param message Содержимое, к-е приходит от пользователя при определенном POST-запросе
 * @param action Текущее действие со стороны пользователя
 */
function readReviewByCategory(category, message, action) {
    let myDict;

    let ss = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1vw0Vtf1D8VIAvacZnXsXA3enVVmJbC0I-WePkan_L6g/edit#gid=0');
    let sheet = ss.getSheetByName(category);
    let allColumnsMovie;

    if (category === 'film') {
        allColumnsMovie = ['id', 'title', 'directors', 'year', 'genre', 'rating', 'description', 'creationDate', 'userEmail', 'localTitle', 'viewed'];
    } else if (category === 'book') {
        allColumnsMovie = ['id', 'title', 'authors', 'year', 'genre', 'rating', 'description', 'creationDate', 'userEmail', 'localTitle', 'viewed'];
    } else {
        allColumnsMovie = ['id', 'title', 'developers', 'year', 'genre', 'rating', 'description', 'creationDate', 'userEmail', 'localTitle', 'viewed'];
    }
    if (action == 'Category') {
        myDict = getData(sheet, allColumnsMovie);
        myDict.pop()
        for (let i in myDict) {
            payload = {
                chat_id: message.message.chat.id,
                text: myDict[i]
            }
            sendMessage(payload);
        }
    } else if (action == 'My category') {
        ss1 = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/10dU6RSG2lRQ9lDjMEXTSgdBMPjjB6FFID6WFSsYz3PU/edit#gid=0');
        sheet1 = ss1.getSheetByName('email');
        let email;
        email = searchEmailByChatID(message.message.chat.id, sheet1);
        myDict = onSearch(email, sheet);
        if (myDict != 'У вас нет отзывов в данной категории!') {
            myDict = myDict.split('\n\n\n');
            myDict.pop();
            for (let i in myDict) {
                payload = {
                    chat_id: message.message.chat.id,
                    text: myDict[i]
                }
                sendMessage(payload);
            }
        } else {
            payload = {
                chat_id: message.message.chat.id,
                text: 'У вас нет отзывов в данной категории!'
            }
            sendMessage(payload);
        }
    }

}

/**
 * Чтение почты по chatID пользователя
 *
 * @param chatID
 * @returns {string} Почта пользователя
 */
function readEmail(chatID) {
    let ss = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/10dU6RSG2lRQ9lDjMEXTSgdBMPjjB6FFID6WFSsYz3PU/edit#gid=0');
    let sheet = ss.getSheetByName('email');
    // получаем список всех chatID
    const reviewIds = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues().map(r => r[0].toString().toLowerCase());
    // получаем позицию полученного chatID из запроса в списке reviewIds
    const posIndex = reviewIds.indexOf(chatID.toString().toLowerCase());
    // Находим строку в таблице с найденной позицией
    const rowNumber = posIndex + 2;
    return sheet.getRange(rowNumber, 2, 1, 1).getValue();
}

/**
 * Обработчик, POST-запросов от телеграмм
 *
 * @param e запрос от телеграмма
 * @returns {*}
 */
function doPost(e) {
    let content = JSON.parse(e.postData.contents);
    let payload;

    if (content.message.text == '/start') {
        if (readEmail(content.message.chat.id) != 'Email') {
            payload = {
                chat_id: content.message.chat.id,
                text: 'Вы уже вводили почту!\nЧтобы удалить текущую почту введите команду /deleteEmail'
            };
            sendMessage(payload);
        } else {
            createAction(content, 'Add email');
            payload = {
                chat_id: content.message.chat.id,
                text: 'Введите Вашу почту:'
            };
            sendMessage(payload);
        }

    } else if (content.message.text == '/category') {
        createAction(content, 'Category');
        payload = {
            chat_id: content.message.chat.id,
            text: 'Введите категорию (цифру 1-3):\n1. Фильмы\n2. Книги\n3. Игры'
        };
        sendMessage(payload);
    } else if (content.message.text == '/my') {
        createAction(content, 'My category');
        payload = {
            chat_id: content.message.chat.id,
            text: 'Введите категорию (цифру 1-3):\n1. Фильмы\n2. Книги\n3. Игры'
        };
        sendMessage(payload);
    } else if (content.message.text == '/add') {
        createAction(content, 'Add');
        payload = {
            chat_id: content.message.chat.id,
            text: 'Введите категорию (цифру 1-3):\n1. Фильмы\n2. Книги\n3. Игры'
        };
        sendMessage(payload);
    } else if (content.message.text == '/change') {
        createAction(content, 'Change');
        payload = {
            chat_id: content.message.chat.id,
            text: 'Введите категорию (цифру 1-3):\n1. Фильмы\n2. Книги\n3. Игры'
        };
        sendMessage(payload);
    } else if (content.message.text == '/delete') {
        createAction(content, 'Delete');
        payload = {
            chat_id: content.message.chat.id,
            text: 'Введите категорию (цифру 1-3):\n1. Фильмы\n2. Книги\n3. Игры'
        };
        sendMessage(payload);
    } else if (content.message.text == '/deleteEmail') {
        let file = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/10dU6RSG2lRQ9lDjMEXTSgdBMPjjB6FFID6WFSsYz3PU/edit#gid=0');
        let sheet = file.getSheetByName('email');
        // Получаем список всех id
        const reviewIds = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues().map(r => r[0].toString().toLowerCase());
        // Получаем позицию полученного id из запроса в списке reviewIds
        const posIndex = reviewIds.indexOf(content.message.chat.id.toString().toLowerCase());
        // Найходим строку в таблице с найденной позицией
        const rowNumber = posIndex + 2;
        sheet.deleteRow(rowNumber);
        payload = {
            chat_id: content.message.chat.id,
            text: 'Почта успешно удалена! Чтобы задать новую почту введите /start'
        };
        sendMessage(payload);
    } else {
        searchAction(content);
    }

    return HtmlService.createHtmlOutput();
}

/**
 * Необходима для корректной работы вебхука
 * @param e
 * @returns {*}
 */
function doGet(e) {
    return HtmlService.createHtmlOutput('hello');
}


