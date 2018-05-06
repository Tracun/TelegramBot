    var token = "YourToken";
    var telegramURL = "https://api.telegram.org/bot" + token;

    var HGWeatherKey = "&key={YourKey}";
    var HGWeatherURL = "https://api.hgbrasil.com/weather/?format=json&city_name=";

    //Dar uma olhada ---> http://www.techtudo.com.br/listas/noticia/2017/02/quinze-bots-que-vao-deixar-seu-telegram-mais-sofisticado.html
    //Dar uma olhada ---> http://www.sptrans.com.br/desenvolvedores/Default.aspx
    //Emojis ---> https://apps.timwhitlock.info/unicode/inspect/hex/1F600-1F64F
    //Dar uma olhada ---> https://blog.pythonanywhere.com/148/

    //Pausar processo - Utilities.sleep(5000);

    //Methods for URLquery
    var getMe = "/getMe"
    var leaveChat = "/leaveChat?chat_id=";
    var getChatMembersCount = "/getChatMembersCount?chat_id=";

    //Emojis
    var emojiSmile = '\uD83D\uDE04';
    var emojiAngry = '\uD83D\uDE20';
    var emojiCrying = '\uD83D\uDE22';
    var emojiDevil = '\uD83D\uDE08';
    var emojiSunGlasses = '\uD83D\uDE0E';
    var emojiThrowKiss = '\uD83D\uDE18'; //Mandando beijo
    var emojiFearful = '\uD83D\uDE28'; //Medroso
    var emojiMonkeyNoSee = '\uD83D\uDE48';
    var emojiFaceTearsOfJoy = '\uD83D\uDE02'; //Rindo muito
    var emojiWinking = '\uD83D\uDE09'; //Piscando
    var emojiDisappointed = '\uD83D\uDE25'; //Desapontado
    var emojiFear = '\uD83D\uDE31'; //Medo/Assustado
    var emojiRollingEyes = '\uD83D\uDE44'; //Olhos para o lado

    //Emojis for weather
    var emojiRain = '\u2614';
    var emojiSun = '\u2600';
    var emojiClouds = '\u2601';

    var emojiList = [emojiSmile,
        emojiAngry,
        emojiCrying,
        emojiDevil,
        emojiSunGlasses,
        emojiThrowKiss,
        emojiFearful,
        emojiMonkeyNoSee,
        emojiFaceTearsOfJoy,
        emojiWinking,
        emojiDisappointed,
        emojiFear,
        emojiRollingEyes
    ];

    var presentationList = ['hi',
        'hello',
        'oi',
        'ola',
        'olá',
        'oii'
    ];

    var weatherList = ['tempo',
        'vai chover hoje?',
        'vai chover?',
        'hoje vai chover?',
        'temperatura'
    ];

    var howAreYouList = ['como voce esta?',
        'how are you?',
        'como esta?',
        'como está?',
        'como você está?',
        'tudo bem?',
        'como vai?'
    ];

    var howAreYouAnswerList = ['Pareço bem para você?',
        'Estou bem e você?',
        'bem.',
        'Com alguns problemas de bot, mas você não entenderia.'
    ];

    function doGet() {

    }

    function doPost(e) {

        var update = JSON.parse(e.postData.contents);

        // Make sure this update is a type message.
        if (update.hasOwnProperty('message')) {
            var msg = update.message;
            var chatId = msg.chat.id;
            var name = msg.chat.username;
            var isGroupType = msg.chat.type;
            var messageAuthor = update.message.from.first_name;
            var translatedMessage;

            //Make sure the update is a command.
            if (msg.hasOwnProperty('entities') && msg.entities[0].type == 'bot_command') {

                //if the users send '/start'
                if (msg.text == '/start') {
                    var message = 'Envie tempo {cidade} para obter a previsão de tempo ' + emojiSmile;

                } else {
                    response('Desculpe, não aprendi isso ainda ' + emojiCrying, chatId);
                }

            } else {

                //What type of message
                if (msg.text) {

                    //I'm in a group
                    if (isGroupType == 'group') {

                        try {

                            var firstLetter = msg.text.substring(0, 1);

                            //Faço um GET(UrlFetchApp) e depois faco um parse de JSON.
                            var chatMembersCount = JSON.parse(UrlFetchApp.fetch(telegramURL + getChatMembersCount + chatId, {
                                'muteHttpExceptions': true
                            }));

                            if (chatMembersCount.result <= 2) {
                                response('Não gosto de grupos, quem mandou me colocar aqui ' + emojiAngry, chatId);
                            } else {
                                //response('Caso precise traduzir uma mensagem, coloque um * na frente de sua mensagem que te devolverei traduzida ' + emojiWinking, chatId);
                            }
                            //case asterisk, translate the rest of message
                            if (firstLetter == '*') {
                                var messageToTranslate = msg.text.substring(1, msg.text.length);

                                translatedMessage = translateMessage(messageToTranslate);
                                response('Mensagem traduzida: \n' + messageAuthor + ': ' + translatedMessage, chatId);
                            }

                        } catch (e) {
                            response('Erro catch group: ' + e, chatId);
                        }

                    } else {

                        try {
                            var city = weather(msg.text);
                        } catch (e) {
                            response('Erro catch weather: ' + e, chatId);
                        }

                        if (city != -1) {

                            try {
                                response(showWeather(city, chatId), chatId);
                            } catch (e) {
                                response('Erro catch if weather: ' + e, chatId);
                            }

                        } else if (presentation(msg.text)) {

                            response(presentationList[Math.floor(Math.random() * 5)], chatId);
                        } else if (howAreYou(msg.text)) {

                            response(howAreYouAnswerList[Math.floor(Math.random() * 4)], chatId);
                        } else {

                            response('Desculpe, não aprendi isso ainda ' + emojiCrying + ' mande sugestões ao meu criador @Tracun', chatId);
                        }

                    }
                } else if (msg.sticker) {
                    response('Maneiro esse Sticker ai ' + emojiSunGlasses, chatId);
                }
            }
        }
    }

    function presentation(msg) {

        var msgLowerCase = msg.toLowerCase();

        for (var i = 0; i < presentationList.length; i++) {
            if (msgLowerCase == presentationList[i]) {
                return true;
            }
        }

        return false;
    }

    function howAreYou(msg) {

        var msgLowerCase = msg.toLowerCase();

        for (var i = 0; i < howAreYouList.length; i++) {
            if (msgLowerCase == howAreYouList[i]) {
                return true;
            }
        }
        return false;
    }

    //Check if you have words related to the weather and return the city
    function weather(msg) {

        var msgLowerCase = msg.toLowerCase();

        for (var i = 0; i < weatherList.length; i++) {

            //Fazendo substring de acordo com o tamanho da string no vetor para verificar se contem palavras que remetem ao tempo(temperatura) de cidades.
            var msgLowerCaseSTR = msgLowerCase.substring(0, weatherList[i].length);

            if (msgLowerCaseSTR == weatherList[i]) {
                //Capta a cidade na mensagem enviada removendo o espaço na posicao [0]
                var city = msgLowerCase.substring(weatherList[i].length + 1, msgLowerCase.length);
                return city;
            }
        }

        //if(msgLowerCase.indexOf("tempo") !== -1 || msgLowerCase.indexOf("chover") !== -1){
        //		return true;
        //} 

        return -1;
    }

    //Search for city temperature in the HGWeather API
    function showWeather(city, chatId) {

        var HGWeatherResponse = UrlFetchApp.fetch(HGWeatherURL + city + HGWeatherKey, {
            'muteHttpExceptions': true
        });

        var weather = JSON.parse(HGWeatherResponse);

        if (!weather.valid_key && weather == null) {

            return "Acho que fiz merd#, não consegui encontrar a previsão para sua cidade, poderia verificar se a cidade que digitou está correta e sem acento? " + emojiCrying;
        } else if (weather.results.city.substring(0, weather.results.city.length - 1).toLowerCase() != city) { //Remove a virgula no final da cidade da API
            return "Não consegui encontrar a previsão para sua cidade, poderia verificar se a cidade que digitou está correta e sem acento? " + emojiCrying;
        } else {

            return "Hoje, " + weather.results.forecast[0].date +
                " " + getWeatherEmoji(weather.results.condition_slug) +
                "\nem " + weather.results.city +
                "\nTemperatura " + weather.results.temp +
                "°C\n" + weather.results.description +
                "\n\nPrevisão para a semana:\n" + showWeatherForecast(weather);
        }
    }

    //Shows the temperature of up to 10 days
    function showWeatherForecast(weather) {

        var weatherForecast = "";
        var atrib = weather.results.forecast[0];

        //Subtraio 3 do resultado para gerar apenas 6 previsoes a partir do segundo registro(i = 1).
        for (var i = 1; i < weather.results.forecast.length - 3; i++) {

            atrib = weather.results.forecast[i];

            //Previsão para os proximos dias
            weatherForecast += atrib.weekday +
                " " + atrib.date +
                " " + getWeatherEmoji(atrib.condition) +
                "-\tMax: " + atrib.max +
                "-\tMin: " + atrib.min +
                "\nDescrição: " + atrib.description +
                "\n\n";
        }
        return weatherForecast;
    }

    //Mostra um emoji referente a condicao do dia
    function getWeatherEmoji(dayCondition) {

        if (dayCondition == "storm") {
            return emojiRain;
        } else if (dayCondition == "cloudly_night" || dayCondition == "cloud") {
            return emojiClouds;
        } else if (dayCondition == "clear_day") {
            return emojiSun;
        } else if (dayCondition == "cloudly_day") {
            return emojiSun + emojiClouds;
        } else {
            return "";
        }
    }

    function translateMessage(msg) {
        return LanguageApp.translate(msg, "", 'pt');
    }

    //sendMessage in telegram API
    function response(msg, chatId) {

        var payload = {
            'method': 'sendMessage',
            'chat_id': String(chatId),
            'text': msg,
            'reply_markup': JSON.stringify({
                'ForceReply': true
            })
        }

        var data = {
            "method": "post",
            "payload": payload,
        }

        //Post a message to user
        UrlFetchApp.fetch(telegramURL + '/', data);
    }