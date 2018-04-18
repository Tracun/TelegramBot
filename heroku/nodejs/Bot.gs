var token = "539988385:AAFqdFTwVEA95xXeY4I1DvjfeLBRA1_5L44";
var telegramURL = "https://api.telegram.org/bot" + token;

/**/

var tokenOpenWeather = "&appid=669578bfa54f61a0b2d719c271ee5b6f";
var weatherURL = "http://api.openweathermap.org/data/2.5/weather?q=";

 ['hi', 
						'hello', 
						'oi', 
						'ola', 
						'olá', 
						'oii'];
						
var weatherList = ['tempo', 
					'vai chover hoje?', 
					'vai chover?', 
					'hoje vai chover?'];
						
var howAreYouList = ['como voce esta?',
					 'how are you?',
					 'como esta?',
					 'como está?',
					 'como você está?'];
					 
var howAreYouAnswerList = ['Pareço bem para você?',
						   'Estou bem e você?',
					       'bem.',
					       'Com alguns problemas de bot, mas você não entenderia.'];

function doPost(e) {
  
  var update = JSON.parse(e.postData.contents);
  
  // Make sure this update is a type message.
  if(update.hasOwnProperty('message')){
	var msg = update.message;
	var chatId = msg.chat.id;
	var name = msg.chat.username;
	
	//Make sure the update is a command.
	if(msg.hasOwnProperty('entities') && msg.entities[0].type == 'bot_command'){
		
		//if the users send '/start'
		if(msg.text =='/start'){
			var message = '/Tempo - Mostra os detalhes da previsão do tempo em sua cidade :)';
		}
	}
	 
	 
	//What type of message
	if(msg.text){

		if(weather(msg.text)){
			response('Qual o nome da sua cidade?', chatId);
          var hora = msg.date;
          
          response(msg, chatId);
          
			if(hora < msg.date ){
				showWeather(msg.text, chatId);
			}
		}else{
	
		if(presentation(msg.text)){
			response('oi', chatId);
		}else if(howAreYou(msg.text)){
			
			response(howAreYouAnswerList[3], chatId);
		}else{
			response('Desculpe, não aprendi isso ainda :\'( fale com meu criador @Tracun', chatId);
		}
	}
	}else if(msg.sticker){
		response('Maneiro esse Sticker ai o_o', chatId);
	}
  }
}

//Put all below into another file
function presentation(msg){
	
	var msgLowerCase = msg.toLowerCase();
	
	for(var i = 0; i < presentationList.length; i++){
		if(msgLowerCase == presentationList[i]){
			return true;
		}
	}

	return false;
}

function howAreYou(msg){
	
	var msgLowerCase = msg.toLowerCase();
	
	for(var i = 0; i < howAreYouList.length; i++){
		if(msgLowerCase == howAreYouList[i]){
			return true;
		}
	}
	return false;
}

function weather(msg){
	
	var msgLowerCase = msg.toLowerCase();
	
	for(var i = 0; i < weatherList.length; i++){
		if(msgLowerCase == weatherList[i]){
			return true;
		}
	}
		
    if(msgLowerCase.indexOf("tempo") !== -1 || msgLowerCase.indexOf("chover") !== -1){
			return true;
    } 
	return false;
}

function showWeather(city, chatId){
	
	var weatherResponse = UrlFetchApp.fetch(weatherURL + city + tokenOpenWeather, {'muteHttpExceptions' : true});
	
	if(weatherResponse.cod != 200){
		response("Acho que fiz merd#, não consegui encontrar a previsão para sua cidade, poderia verificar se a cidade que digitou está correta? :(", chatId);
	}else{
		response(weatherResponse, chatId);
	}
	return false;
}

function response(msg, chatId){
  
  //sendMessage in telegram API
	var payload = {
		'method': 'sendMessage',
		'chat_id': String(chatId), 
		'text': msg,
      'reply_markup' : JSON.stringify({
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