const telegram = require('telegram-bot-api');
const TeleBot = require('telebot');
const util = require('util')
const token = [YOUR BOT_TOKEN];
const api = new
 telegram({
        token: token,
	updates: 
	{
		enabled: true
	}
});
const bot = new TeleBot(token, 
{
	polling: // Optional. Use polling. 
	{ 
        interval: 1000, // Optional. How often check updates (in ms).
        timeout: 0, // Optional. Update polling timeout (0 - short polling).
        limit: 100, // Optional. Limits the number of updates to be retrieved.
        retryTimeout: 5000, // Optional. Reconnecting timeout (in ms).
    	}
});
const TIME_TO_DESTROY = 40; //time in seconds
var echo_mas = [];
var users = [];
var BotID = [BOT_ID];

function user_seaker (fromId)
{
	var i = -1;
	for (i = 0; users[i] != fromId && users[i] != undefined; i++)
	if (users[i] != fromId) users[i] = fromId;
	return i;
}

function boom_msg (seconds, chatID, msgID)
{
	setTimeout(function() 
	{
		bot.editMessageText
		(
			{chatId:chatID, messageId:msgID}, "del"
		).catch(error => console.log('Error:', error));
		bot.deleteMessage
		(
			chatID, msgID
		).catch(error => console.log('Error:', error));
			
	}, seconds*1000);
	return 0;
}

function BigBOOM (date, seconds, chatID, msgID, need_replay)
{
	if (need_replay == false)
	{
		boom_msg(seconds, chatID, msgID);
	}
	else
	{
		
	}
	return 0;
}

function SendMSG (chatID, msg_text)
{
	var MSGID = -1;
	bot.sendMessage(chatID, msg_text)
	.then(message => 
	{
        	console.log(message);
		MSGID = message.result.message_id;
		BigBOOM(message.result.date, TIME_TO_DESTROY, chatID, message.result.message_id, false);
    	});

	return MSGID;
}

api.on('inline.query', function(message)
{
    // Received inline query
    console.log(message);
});

api.on('inline.result', function(message)
{
    // Received chosen inline result
    console.log(message);
});

api.on('inline.callback.query', function(message)
{
    // New incoming callback query
    console.log(message);
});

api.on('edited.message', function(message)
{
    // Message that was edited
    console.log(message); 
});

api.on('update', function(message)
{
	// Generic update object
	// Subscribe on it in case if you want to handle all possible
	// event types in one callback
    console.log(message);
});

bot.on([/^\/echo (.+)$/, /^\/say (.+)$/], (msg, props) => 
{
	const text = props.match[1];
	SendMSG(msg.from.id, text);
});

bot.on(['/echo1', '/echoON'] , (msg) =>
{
	var Local_ID = user_seaker (msg.from.id);
	if (echo_mas[Local_ID] != true) 
	{
		echo_mas[Local_ID] = true;
		return SendMSG(msg.from.id, "Now I will repeat all your messages");
	}
	else
	{
		return 0;
	}
});

bot.on(['/echo0', '/echoOFF'], (msg) => 
{
	var Local_ID = user_seaker (msg.from.id);
	if (echo_mas[Local_ID] != false) 
	{
		echo_mas[Local_ID] = false;
		return SendMSG(msg.from.id, "Now I will not repeat all your messages");
	}
	else
	{
		return 0;
	}
});

bot.on([ '/help', '/helpme', '/man'] , (msg, props) => 
{
	return SendMSG(msg.chat.id, "MAN PAGE /echo || /say - Retry your message. For example, if you type /echo hello, you get the message\"hello\" \n /echo1 || /echoON - repeat all your messages \n /echo0 || /echoOFF - not repeat all your messages (deafult) \n /help || /helpme || /man - man page");
});

bot.on('text', msg => 
{
	console.log(msg);
	var Local_ID = user_seaker (msg.from.id);
	if (echo_mas[Local_ID] == true && msg.text != '/echo1' && msg.text != '/echo0') 
	{ 
		return SendMSG(msg.chat.id, msg.text);
	}
	else
	{
		return 0;
	}
});

bot.on('stop', msg => 
{
	return SendMSG(msg.chat.id, "Don't do that!");
});

bot.on('update', msg =>
{
	console.log(msg);
});

bot.on('error', msg =>
{
	console.log(msg);
});



bot.start();
