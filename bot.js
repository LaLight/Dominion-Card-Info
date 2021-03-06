"use strict";
const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const fs = require('fs');
const help = require('./helptext.json');
const texts = require('./cardtexts.json');

client.once('ready', () => {
  console.log('READY');
});

function stop() {
  process.exit(0);
}

function getFileURL(name) {
  let out = name.toLowerCase().replace(/ +/g, '-');
  out += '.jpg';
  out = './images/' + out;

  if(!fs.existsSync(out)) {
    out = 'ERROR';
  }

  return out;
}

function getCardText(name) {
  let out = name.toLowerCase().replace(/ +/g, '-');

  let embed = {
    "embed": {
      "color": 1703701,
      "footer": {
        "text": "Dominion Card Info"
      },
      "fields": [
        {
          "name": "ERROR - notify owner",
          "value": "ERROR - notify owner"
        }
      ]
    }
  };

  if(texts.hasOwnProperty(out)) {
    embed.embed.fields[0].name = texts[out][0];
    embed.embed.fields[0].value = texts[out][1];
  } else {
    embed.embed.fields[0].name = 'Card Invalid!';
    embed.embed.fields[0].value = '`' + name + '` is not a valid card or has not yet been implemented.';
  }

  return embed;
}

let API_USES = 0;
client.on('message', message => {
  /*if(message.channel.id !== '376515661234438169') {
    return;
  }*/

  if(message.content === '!disconnect' && message.author.id === config.owner) {
    message.delete();
    client.user.setStatus('invisible');
    setTimeout(stop, 5000);

    API_USES += 1;
    console.log(`API REQUESTS: ${API_USES}`);
  }

  if(message.content.toLowerCase().startsWith('cardart ')) {
    let card = message.content.substring(8);
    let path = getFileURL(card);
    let illustrator = card.toLowerCase().replace(/ +/g, '-');

    if(path !== 'ERROR') {
      if(texts.hasOwnProperty(illustrator)) {
        illustrator = 'Illustrated by: ' + texts[illustrator][2] + '.';
      } else {
        illustrator = 'illustrator not yet implemented.'
      }

      message.channel.send(illustrator, {files: [path]});
    } else {
      message.reply(`\`${card}\` is not a valid card!`);
    }

    API_USES += 1;
    console.log(`API REQUESTS: ${API_USES}`);
  }

  if(message.content.toLowerCase().startsWith('cardtext ')) {
    let card = message.content.substring(9);
    message.channel.send(getCardText(card));

    API_USES += 1;
    console.log(`API REQUESTS: ${API_USES}`);
  }

  if(message.content.toLowerCase().startsWith('card ')) {
    message.channel.send('Coming soon!');

    API_USES += 1;
    console.log(`API REQUESTS: ${API_USES}`);
  }

  if(message.content.startsWith('!help')) {
    message.channel.send(help.text);

    API_USES += 1;
    console.log(`API REQUESTS: ${API_USES}`);
  }
});

client.login(config.token);
