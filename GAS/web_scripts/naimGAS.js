function getData(sheet, allColumnsMovie) {

    let allReplay = {};
    let allReviewsList = [];
    sheetRange = sheet.getDataRange();
    sheetValues = sheetRange.getValues();
    // Добавляем все строки талбицы категории в список allReviewsList
    for (var i = 1; i < parseInt(sheetValues.length); i++) {
        let user = {};
        for (let j in allColumnsMovie) {
            // если встречается жанр, парсим строку и добавляем в словарь список
            // фильм ужасов, детектив => ['фильм ужасов', 'детектив']
            if (allColumnsMovie[j] === 'genre') {
                user[allColumnsMovie[j]] = sheetValues[i][j].split(', ');
            }
                // парсим строку и добавляем в словарь список
            // значение менятеся в зависимтости от категории ('directors', 'authors', 'developers')
            else if (allColumnsMovie[j] === 'directors' || allColumnsMovie[j] === 'authors' || allColumnsMovie[j] === 'developers') {
                user[allColumnsMovie[j]] = sheetValues[i][j].split(', ');
            } else {
                user[allColumnsMovie[j]] = sheetValues[i][j];
            }
        }
        allReviewsList.push(user);
    }
    allReplay['allReviews'] = allReviewsList;
    return allReplay;
}

function onSearch(email, sheet, allColumnsMovie) {
    let all_reviews_user = [];
    let sheet_range = sheet.getDataRange();
    let sheetValues = sheet_range.getValues();

    let filteredRows = sheetValues.filter(function (row) {
        if (row[8] === email) {
            let tempDict = {};
            for (let i = 0; i < row.length; i++) {

                for (let j in allColumnsMovie) {
                    // если встречается жанр, парсим строку и добавляем в словарь список
                    // фильм ужасов, детектив => ['фильм ужасов', 'детектив']
                    if (allColumnsMovie[j] === 'genre') {
                        tempDict[allColumnsMovie[j]] = row[j].split(', ');
                    }
                        // парсим строку и добавляем в словарь список
                    // значение менятеся в зависимтости от категории ('directors', 'authors', 'developers')
                    else if (allColumnsMovie[j] === 'directors' || allColumnsMovie[j] === 'authors' || allColumnsMovie[j] === 'developers') {
                        tempDict[allColumnsMovie[j]] = row[j].split(', ');
                    } else {
                        tempDict[allColumnsMovie[j]] = row[j];
                    }
                }
            }
            all_reviews_user.push(tempDict);
        }
    });
    let result = {};
    result["allReviewsUser"] = all_reviews_user;
    return result;
}


function deleteById(id, email, sheet, allColumnsMovie) {
    const lengthAllColumnsMovie = parseInt(allColumnsMovie.length);
    // Получаем список всех id
    const reviewIds = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues().map(r => r[0].toString().toLowerCase());
    // Получаем позицию полученного id из запроса в списке reviewIds
    const posIndex = reviewIds.indexOf(id.toString().toLowerCase());
    // Если id не найден в reviewIds выходим из ф-и и возвращаем сообщение
    if (posIndex === -1) {
        return {"result": "Error! There is no such id!"};
    }
    // Найходим строку в таблице с найденной позицией
    const rowNumber = posIndex + 2;
    // Получаем почту в найденной строке
    // если почта совпадает с почтой из запроса, тогда удаляем строку
    // иначе возвращаем ошибку о несовпадении почт
    const currentEmail = sheet.getRange(rowNumber, lengthAllColumnsMovie).getValues().map(r => r[0].toString());
    if (currentEmail == email) {
        sheet.deleteRow(rowNumber);
        return {"result": "OK! Deleted it."};
    } else {
        return {"result": "Error! Emails don't converge!"};
    }
}


function parceDataToList(reviewInfo, allColumnsMovie) {
    // let reviewInfo = {"userEmail":"another@gmail.com","genre":"жудожка","category":"film","title":"my book","authors":"Петя","creationDate":"2021-05-20T15:02:32.000Z","rating":"10","year":"2020","add":"true","description":"Нехорошее книг","id":0};
    // let allColumnsMovie = ['id', 'title', 'director', 'year', 'genre', 'rating', 'description', 'creationDate', 'userEmail'];

    // Создаем список для добавления измененных строк
    let postAppendRow = [];
    for (let i in allColumnsMovie) {
        // если встречаем заголовок таблицы 'creationDate', преобразуем данные в формате - dd.mm.yyyy hh:mm:ss
        if (allColumnsMovie[i] === 'creationDate') {
            let stringCreationDate = reviewInfo[allColumnsMovie[i]];
            const MyDate = new Date(stringCreationDate);
            let MyDateString;
            MyDate.setDate(MyDate.getDate());
            MyDateString = ('0' + MyDate.getDate()).slice(-2) + '.'
                + ('0' + (MyDate.getMonth() + 1)).slice(-2) + '.'
                + MyDate.getFullYear() + ' ' + ('0' + MyDate.getHours()).slice(-2)
                + ':' + ('0' + MyDate.getMinutes()).slice(-2)
                + ':' + ('0' + MyDate.getSeconds()).slice(-2);
            postAppendRow.push(MyDateString);
        } else {
            postAppendRow.push(reviewInfo[allColumnsMovie[i]]);
        }
    }
    // Logger.log(postAppendRow)
    return postAppendRow;
}


function editReviewById(reviewInfo, sheet, allColumnsMovie) {
    const lengthAllColumnsMovie = parseInt(allColumnsMovie.length);
    // получаем id  и потчу пользователя
    let email = reviewInfo['userEmail'];
    let id = reviewInfo['id'];
    // получаем список с предварительными данными для занесения их в таблицу
    let postAppendRow = parceDataToList(reviewInfo, allColumnsMovie);
    // удаляем первый элемент списка, так как менять его не будем
    postAppendRow.shift()
    // получаем список всех id
    const reviewIds = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues().map(r => r[0].toString().toLowerCase());
    // получаем позицию полученного id из запроса в списке reviewIds
    const posIndex = reviewIds.indexOf(id.toString().toLowerCase());
    // Если id не найден в reviewIds выходим из ф-и и возвращаем сообщение
    if (posIndex === -1) {
        Logger.log('no id')
        return {"result": "Error! There is no such id!"};
    }
    // Находим строку в таблице с найденной позицией
    const rowNumber = posIndex + 2;
    // Получаем почту в найденной строке
    // если почта совпадает с почтой из запроса, тогда изменяем строку
    // иначе возвращаем ошибку о несовпадении почт
    const currentEmail = sheet.getRange(rowNumber, lengthAllColumnsMovie).getValues().map(r => r[0].toString())[0];
    if (email === currentEmail) {
        sheet.getRange(rowNumber, 2, 1, lengthAllColumnsMovie - 1).setValues([postAppendRow]);
        return {"result": "OK! Changed it."};
    } else {
        return {"result": "Error! Emails don't converge!"};
    }
}


function addReview(reviewInfo, sheet, allColumnsMovie) {
    // добавляем поле id для корректного парсинга приходящих данных
    reviewInfo['id'] = 0;
    // получаем список с предварительными данными для занесения их в таблицу
    let postAppendRow = parceDataToList(reviewInfo, allColumnsMovie);

    // массив уникальных идентификаторов таблицы
    const uniqueIDs = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues();
    // находим максимальный id
    let maxNum = 0;
    uniqueIDs.forEach(r => {
        maxNum = r[0] > maxNum ? r[0] : maxNum
    });
    let newId = maxNum + 1;
    // меняем поле id=0 на корректное
    postAppendRow[0] = newId;

    // добавялем строку к нашей таблице
    sheet.appendRow([
        postAppendRow[0],
        postAppendRow[1],
        postAppendRow[2],
        postAppendRow[3],
        postAppendRow[4],
        postAppendRow[5],
        postAppendRow[6],
        postAppendRow[7],
        postAppendRow[8],
    ]);
    // возвращаем результат об успешном добавлении нового отзыва
    return {"result": "OK! Added it."};
}


function doGet(e) {

    const category = e.parameter.category;

    let ss = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1vw0Vtf1D8VIAvacZnXsXA3enVVmJbC0I-WePkan_L6g/edit#gid=0');
    let sheet = ss.getSheetByName(category);
    let allColumnsMovie;

    if (category === 'film') {
        allColumnsMovie = ['id', 'title', 'directors', 'year', 'genre', 'rating', 'description', 'creationDate', 'userEmail'];
    } else if (category === 'book') {
        allColumnsMovie = ['id', 'title', 'authors', 'year', 'genre', 'rating', 'description', 'creationDate', 'userEmail'];
    } else {
        allColumnsMovie = ['id', 'title', 'developers', 'year', 'genre', 'rating', 'description', 'creationDate', 'userEmail'];
    }


    if (e.parameter.reviews === "all") {
        my_dict = getData(sheet, allColumnsMovie)
        return ContentService.createTextOutput(JSON.stringify(my_dict)).setMimeType(ContentService.MimeType.JSON);
    } else if ('email' in e.parameter) {
        all_reviews_user = onSearch(e.parameter.email, sheet, allColumnsMovie)
        return ContentService.createTextOutput(JSON.stringify(all_reviews_user)).setMimeType(ContentService.MimeType.JSON);
    } else {
        result = {"result": "Error! The request does not exist!"};
        return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
    }
}


function doPost(e) {

    let category = e.parameter.category;

    let ss = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1vw0Vtf1D8VIAvacZnXsXA3enVVmJbC0I-WePkan_L6g/edit#gid=0');
    let sheet = ss.getSheetByName(category);
    let allColumnsMovie;

    if (category === 'film') {
        allColumnsMovie = ['id', 'title', 'directors', 'year', 'genre', 'rating', 'description', 'creationDate', 'userEmail'];
    } else if (category === 'book') {
        allColumnsMovie = ['id', 'title', 'authors', 'year', 'genre', 'rating', 'description', 'creationDate', 'userEmail'];
    } else {
        allColumnsMovie = ['id', 'title', 'developers', 'year', 'genre', 'rating', 'description', 'creationDate', 'userEmail'];
    }


    if (e.parameter.delete === 'true') {
        result = deleteById(e.parameter.id, e.parameter.email, sheet, allColumnsMovie);
        return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
    } else if (e.parameter.change === 'true') {
        result = editReviewById(e.parameter, sheet, allColumnsMovie);
        return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
    } else if (e.parameter.add === 'true') {
        result = addReview(e.parameter, sheet, allColumnsMovie);
        return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
    } else {
        result = {"result": "Error! The request does not exist!"};
        return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
    }
}