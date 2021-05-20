let ss = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1vw0Vtf1D8VIAvacZnXsXA3enVVmJbC0I-WePkan_L6g/edit#gid=0"),
    sheet = ss.getSheetByName("Films");

let allColumnsMovie = ['id', 'title', 'director', 'year', 'genre', 'rating', 'description', 'creationDate', 'userEmail'];
const lengthAllColumnsMovie = parseInt(allColumnsMovie.length);


function getData() {

    let allReplay = {}
    let allReviewsList = []
    sheet_range = sheet.getDataRange();
    sheetValues = sheet_range.getValues();
    // Добавляем все строки талбицы категории Films в список allReviewsList
    for (var i = 1; i < parseInt(sheetValues.length); i++) {
        let user = {}
        for (let j in allColumnsMovie) {
            if (allColumnsMovie[j] === 'genre') {
                user[allColumnsMovie[j]] = sheetValues[i][j].split(', ')
            } else {
                user[allColumnsMovie[j]] = sheetValues[i][j]
            }
        }
        allReviewsList.push(user)
    }
    allReplay['allReviews'] = allReviewsList
    return allReplay
}

function onSearch(email) {
    let all_reviews_user = []
    let sheet_range = sheet.getDataRange();
    let sheetValues = sheet_range.getValues();


    let filteredRows = sheetValues.filter(function (row) {
        if (row[8] === email) {
            let tempDict = {}
            for (let i = 0; i < row.length; i++) {

                for (let j in allColumnsMovie) {
                    if (allColumnsMovie[j] === 'genre') {
                        tempDict[allColumnsMovie[j]] = row[j].split(', ')
                    } else {
                        tempDict[allColumnsMovie[j]] = row[j]
                    }
                }
            }

            all_reviews_user.push(tempDict)
        }
    });

    let result = {};
    result["allReviewsUser"] = all_reviews_user
    return result;
}


function doGet(e) {
    my_dict = getData()
    if (e.parameter.query === "category") {
        return ContentService.createTextOutput(JSON.stringify(my_dict)).setMimeType(ContentService.MimeType.JSON);
    }

    if (e.parameter.email != undefined) {
        all_reviews_user = onSearch(e.parameter.email)
        return ContentService.createTextOutput(JSON.stringify(all_reviews_user)).setMimeType(ContentService.MimeType.JSON);
    }

}


function deleteById(id, email) {
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


function editReviewById(reviewInfo) {
    let email = reviewInfo['userEmail'];
    let id = reviewInfo['id'];

    // Готовим полученны данные для изменения строки
    let postAppendRow = []
    for (let i in allColumnsMovie) {
        if (allColumnsMovie[i] === 'creationDate') {
            let stringCreationDate = reviewInfo[allColumnsMovie[i]]
            const MyDate = new Date(stringCreationDate) // formated_Date - SDK returned date
            let MyDateString;
            MyDate.setDate(MyDate.getDate());
            MyDateString = ('0' + MyDate.getDate()).slice(-2) + '.'
                + ('0' + (MyDate.getMonth() + 1)).slice(-2) + '.'
                + MyDate.getFullYear();
            postAppendRow.push(MyDateString)
        } else {
            postAppendRow.push(reviewInfo[allColumnsMovie[i]])
        }
    }
    postAppendRow.shift()


    // Получаем список всех id
    const reviewIds = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues().map(r => r[0].toString().toLowerCase());
    // Получаем позицию полученного id из запроса в списке reviewIds
    const posIndex = reviewIds.indexOf(id.toString().toLowerCase());

    // Если id не найден в reviewIds выходим из ф-и и возвращаем сообщение
    if (posIndex === -1) {
        Logger.log('no id')
        return {"result": "Error! There is no such id!"};
    }

    // Найходим строку в таблице с найденной позицией
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


function addReview(reviewInfo) {

    reviewInfo['id'] = 0;

    // Готовим полученны данные для изменения строки
    let postAppendRow = []
    for (let i in allColumnsMovie) {
        if (allColumnsMovie[i] === 'creationDate') {
            let stringCreationDate = reviewInfo[allColumnsMovie[i]]
            const MyDate = new Date(stringCreationDate) // formated_Date - SDK returned date
            let MyDateString;
            MyDate.setDate(MyDate.getDate());
            MyDateString = ('0' + MyDate.getDate()).slice(-2) + '.'
                + ('0' + (MyDate.getMonth() + 1)).slice(-2) + '.'
                + MyDate.getFullYear();
            postAppendRow.push(MyDateString)
        } else {
            postAppendRow.push(reviewInfo[allColumnsMovie[i]])
        }
    }


    const uniqueIDs = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues();
    let maxNum = 0;
    uniqueIDs.forEach(r => {
        maxNum = r[0] > maxNum ? r[0] : maxNum
    });
    let newId = maxNum + 1;

    postAppendRow[0] = newId;
    let my_arr = [7, 'lol', 'kek']

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
    return {"result": "OK! Added it."};
}


function doPost(e) {

    if ('delete' in e.parameter) {
        result = deleteById(e.parameter.delete, e.parameter.email);
        return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
    } else if (e.parameter.change === 'true') {
        result = editReviewById(e.parameter);
        return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
    } else if (e.parameter.add === 'true') {
        result = addReview(e.parameter);
        return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
    }


}