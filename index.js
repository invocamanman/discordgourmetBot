const Discord = require('discord.js');
const client = new Discord.Client();
const { prefix, token } = require('./config.json');

const champions = require('./champions.json');
const fetch = require("node-fetch");
const ytdl = require('ytdl-core');


let dispatcher
let championsarray = [];
for (x in champions) {
   championsarray.push(x)
}

let championsmarksman = [];
for (x in champions) {
    
    if( (champions[x].tags[0] == 'Marksman')|| (champions[x].tags[1] == 'Marksman'))
    {
        championsmarksman.push(x)
    }
    
 }
 

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
      [array[i], array[j]] = [array[j], array[i]]; // swap elements
    }
  }

  let status;
  let respuesta;
  
  async function getgame(name){

    return new Promise (function (resolve,reject){
        fetch(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}`,  {headers: {
        "X-Riot-Token": "RGAPI-2d2f1fc5-3b2b-4187-ab16-8f9d1aa8dbd9"
      }})
    .then(function(response) {
       
      return response.json();
    })
    .then(function(json) {
      console.log("json1",json);
      console.log("json2",json.id)
      fetch(`https://euw1.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/${json.id}`,  {headers: {
        "X-Riot-Token": "RGAPI-2d2f1fc5-3b2b-4187-ab16-8f9d1aa8dbd9"
      }}).then(function(response) {
            if (response.status==200)
                status=true;
            else
                status = false;
            return response.json();
         })
        .then(function(json) {
            let compañeros=[];
            if(status)
            {
                console.log(json);
                console.log("respuesta", respuesta)
                console.log("respuesta", json.participants)
                json.participants.map(item=> {
                    compañeros.push(item.summonerName)
                })
                
                respuesta = "Esta jugando, y lleva: " + json.gameLength/60 + " minutos, con: "+ compañeros;
            }
            else{
                respuesta = "no esta jugando ahora mismo"
            }
           
            resolve(respuesta);
        });
       
    });

  })
};
  
async function getjoke(){

    return new Promise (function (resolve,reject){
        fetch("https://icanhazdadjoke.com/", {
  headers: {
    Accept: "application/json"
  }
})
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
        console.log(json)
      resolve(json.joke)
    })
})
};
let rolesarray =['Fighter', 'Tank', 'Mage', 'Assassin', 'Support', 'Marksman']

client.once('ready', () => {
    
    console.log('Ready!');
    
});

client.login(token);

client.on('message', message => {

    //if (!message.content.startsWith(prefix) ) return;
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    switch (command) {
        case "randomizer":
            if (message.mentions.users.size!=5) {
                return message.channel.send(`Hay 5 invocadores en la grieta EMPANAO`);
            }
            let summonerlist = message.mentions.users.map(user => user.username);

           shuffle(summonerlist)   
            message.channel.send(`Top: ${summonerlist[0]}, Mid: ${summonerlist[1]}, Jungler: ${summonerlist[2]}, Adc: ${summonerlist[3]}, Support: ${summonerlist[4]} `)
            // send the entire array of strings as a message
            // by default, discord.js will `.join()` the array with `\n`
             break;

        case "megarandomizer":
             if (message.mentions.users.size!=5) {
                 return message.channel.send(`Hay 5 invocadores en la grieta EMPANAO`);
             }
             let summonerlist2 = message.mentions.users.map(user => user.username);
 
            shuffle(summonerlist2)   
            
        
             masarrayquenunca = [];
             masarrayquenunca.push(rolesarray[Math.floor(Math.random()*(2))]) //top
             masarrayquenunca.push(rolesarray[Math.floor(Math.random()*(2))+2])//mid
             masarrayquenunca.push(rolesarray[Math.floor(Math.random()*(2))])//jungler
             masarrayquenunca.push(rolesarray[5])//adc
             masarrayquenunca.push(rolesarray[4]) //supp
            
            console.log(masarrayquenunca)
            championarray = []
            masarrayquenunca.map(function (rol){
                let championsrol2 = [];
                console.log('hg', rol)
                for (x in champions) {
                    if( (champions[x].tags[0] == rol)|| (champions[x].tags[1] == rol))
                    {
                        championsrol2.push(x)
                    }
                }
                championarray.push(championsrol2[Math.floor(Math.random()*( championsrol2.length))])
            })
        
             message.channel.send(`Top: ${summonerlist2[0]} con el champ: ${championarray[0]}  \n Mid: ${summonerlist2[1]},con el champ: ${championarray[1]}\n Jungler: ${summonerlist2[2]},con el champ: ${championarray[2]}\n Adc: ${summonerlist2[3]},con el champ: ${championarray[3]}\n Support: ${summonerlist2[4]} con el champ: ${championarray[4]}`)
             // send the entire array of strings as a message
             // by default, discord.js will `.join()` the array with `\n`
              break;

           
        case "randomrol":
                let thisrol = args[0].charAt(0).toUpperCase() + args[0].substring(1);
                if (!rolesarray.includes(thisrol) ) {
                    return message.channel.send(`Tiene que poner uno de estos, señor  ${message.author}!, ${rolesarray}`);
                }
                let championsrol = [];

                for (x in champions) {
                    
                    if( (champions[x].tags[0] == thisrol)|| (champions[x].tags[1] == thisrol))
                    {
                        championsrol.push(x)
                    }
                    
                }

                let randomrol = Math.floor(Math.random()*( championsrol.length))
                message.channel.send(`${message.author}, tu champeón és:  ${championsrol[randomrol]}`)
                break
 
        
        case "amigos?":
            message.channel.send('hay alguien ahí?', {tts: true})
            break;
        case "olo":
            message.channel.send('olooooooooooo cabesaboloooo', {tts: true})
            break;
        case "emojis":
                    message.guild.emojis.forEach(customEmoji => {
                    console.log(`Reacting with custom emoji: ${customEmoji.name} (${customEmoji.id})`)
                    //receivedMessage.react(customEmoji)
                            // message.channel.send(`<:${customEmoji.name}:${customEmoji.id}>`, {tts: true})
                    // let customEmoji = receivedMessage.guild.emojis.get(emojiId)
                    //receivedMessage.react(customEmoji)
                })
            break;
        case "bonanit":
            message.channel.send('buenas noches gente', {tts: true}); 
        case "thx":
            message.channel.send('^^'); 
            break;
        case "prueba":
                console.log(message.author)
                if(message.author.id==322027225195216896)
                    message.channel.send('ajaaa jesus'); 
                else
                    message.channel.send('no jesus'); 
                break;
        case "bonanit":
            message.channel.send('buenas noches gente', {tts: true});
        case "musica":
                
        if (!args.length) {
            return message.channel.send(`pon la url joder, de youtube si puede ser, ${message.author}!`);
        }
            if (message.channel.type !== 'text') return;
    
            const { voiceChannel } = message.member;
    
            if (!voiceChannel) {
                return message.reply('please join a voice channel first!');
            }
    
            voiceChannel.join().then(connection => {
                const stream = ytdl(args[0], { filter: 'audioonly' });
                dispatcher = connection.playStream(stream);
    
                dispatcher.on('end', () => voiceChannel.leave());
            });
            break;
        case "parayaa":  
            dispatcher.end();
            break;
        case "para":  
            return message.reply("LYRICS: \n\nWe're no strangers to love \nYou know the rules and so do I \nA full commitment's what I'm thinking of \nYou wouldn't get this from any other guy \nI just wanna tell you how I'm feeling \nGotta make you understand \nNever gonna give you up \nNever gonna let you down \nNever gonna run around and desert you \nNever gonna make you cry \nNever gonna say goodbye \nNever gonna tell a lie and hurt you \nWe've known each other for so long \nYour heart's been aching but you're too shy to say it \nInside we both know what's been going on \nWe know the game and we're gonna play it \nAnd if you ask me how I'm feeling \nDon't tell me you're too blind to see \nNever gonna give you up \nNever gonna let you down \nNever gonna run around and desert you \nNever gonna make you cry \nNever gonna say goodbye \nNever gonna… ");
            break;
        case "noporfa":
        case "randomchamp":
            let random = Math.floor(Math.random()*( championsarray.length))
            message.channel.send(`${message.author}, tu champeón és:  ${championsarray[random]}`)
            break;
               
        case "Beep":
        message.channel.send('Boop.');
        break;

        case "pagalacocaenric":
        message.channel.send('https://www.patreon.com/himebot');
        break;
        case "pepega":
        message.channel.send(`<:Pepega:494501983705628703> <:Pepega:494501983705628703> <:Pepega:494501983705628703> <:Pepega:494501983705628703> <:Pepega:494501983705628703> <:Pepega:494501983705628703> <:Pepega:494501983705628703> <:Pepega:494501983705628703> <:Pepega:494501983705628703> <:Pepega:494501983705628703> <:Pepega:494501983705628703> <:Pepega:494501983705628703> <:Pepega:494501983705628703> <:Pepega:494501983705628703> `);
        break;
        case "weebsout":
        message.channel.send(`<:DansGame:443432789552136194> 👉 🚪 `);
        break;
        case "randomizer2":

        console.log(args, args.length)
        if (!args.length) {
            return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
        }
            if (args.length!=5) {
                console.log(args.length,5)
                message.channel.send(`EMPANAO`, {tts: true});
                return message.channel.send(`Hay 5 invocadores en la grieta EMPANAO`,);
            } 
                  
            shuffle(args);           
            message.channel.send(`Top: ${args[0]}, Mid: ${args[1]}, Jungler: ${args[2]}, Adc: ${args[3]}, Support: ${args[4]}`, {tts: true})
            // send the entire array of strings as a message
            // by default, discord.js will `.join()` the array with `\n`
             break;

        case "randonizer2":

             console.log(args, args.length)
             if (!args.length) {
                 return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
             }
                 if (args.length!=5) {
                     console.log(args.length,5)
                     message.channel.send(`EMPANAO`, {tts: true});
                     return message.channel.send(`Hay 5 invocadores en la grieta EMPANAO`,);
                 } 
                       
                 shuffle(args); 
                 let index= args.indexOf('litowl');
                 if (index != -1){
                    [args[4], args[index]] = [args[index], args[4]]; // swap elements 
                 }
     
                 message.channel.send(`Top: ${args[0]}, Mid: ${args[1]}, Jungler: ${args[2]}, Adc: ${args[3]}, Support: ${args[4]}`)
                 // send the entire array of strings as a message
                 // by default, discord.js will `.join()` the array with `\n`
                  break;
     
        case "help":
            console.log(message.author.id,message.author.username)//enric 136167415171121152
             message.channel.send('a pedir help en tu puta casa :)', {tts: true});
            break;
           
        case "commands":
            console.log(message.author.id,message.author.username)//enric 136167415171121152
             message.channel.send(' jugandolol -arguments: summoner name --> dice si esta jugando, cuanto tiempo y con quién ^^ \nrandomizer -arguments: 5 menciones --> random linea  \n megarandomizer -arguments: 5 menciones --> random linea + random champ\n randomizer2 -arguments: escribir 5 nombres --> linea random cada uno \n randomchamp --> champ random \n randomrol -arguments: rol --> random champ de ese rol   \n musica -arguments: URL youtube \n para --> para la musica <:Pepega:494501983705628703> \n pagalacocaenric \n weebsout \n pepega  \n adictaduramanodura \n caracruz -arugments: nada o 2 opciones \n dados \n david \n jesusdejaelbotytrabaja \n amigos? \n olo \n bonanit \n !help', {tts: true});
            break;   
        case "nsfw":
            message.channel.send('No se fer wilipolleces :)', {tts: true});
            break;
        case "pepegasloop":
            message.channel.send('<:Pepega:494501983705628703> loop', {tts: true});
            break;
        case "evo":
            message.channel.send('https://www.twitch.tv/evo');
            break;
        case "elimina":
        if(message.author.id==136168127602884608 && (args[0]!=2))
            message.channel.send('a eliminar a tu puta casa'); 
        else{
            //console.log(message.author)
            let amount = parseInt(args[0]);
            message.channel.bulkDelete(amount);
        }
        break;
        case "felicitar":
        if (message.author.id==136168127602884608||message.author.discriminator==3505)
             message.channel.send('a eliminar a tu puta casa'); 
        else{
            let member = message.mentions.members.first();
        if(member.id==356919606964781056)
            message.channel.send('no se peude felicitar a enric'); 
        else{
            let member = message.mentions.members.first();
            member.kick();
        }

         }
        break;
        case "nopasamemes":
            const role = message.guild.roles.find(role => role.name === 'No pasar memes per general');
            const member = message.mentions.members.first();
            member.addRole(role);
            break;
        case "sipasamemes":
            const role2 = message.guild.roles.find(role => role.name === 'No pasar memes per general');
            const member2 = message.mentions.members.first();
            member2.removeRole(role2);
            break;
        case "adictaduramanodura":
                    for ( let i = 0; i<3; i++){
                        const webAttachment = new Discord.Attachment('https://cdn.discordapp.com/attachments/269766159665070080/606873473867972608/unknown.png')
                        message.channel.send(webAttachment)
                    }

                break;
        case "caracruz":
                let moneda=Math.floor(Math.random() * 2);
                if (args.length== 2)
                {
                if(moneda ==0)
                  message.channel.send(args[0]);
                else
                  message.channel.send(args[1]);
                }
                else{
                    if(moneda ==0)
                    message.channel.send('CARA');
                  else
                    message.channel.send('CRUZ');
                }

                break;
        case "jugandolol":
                getgame(args[0]).then(function(respuesa){
                    message.channel.send(respuesta)                   
                })
                
                break;
        case "chistako":
                getjoke().then(function(respuesta){
                    message.channel.send(respuesta)                   
                })
                
                break;
        case "dados":
            message.channel.send(2);
            break; 
        case "david":
            message.channel.send("Tus PDV estan al máximo ahora");
            break; 
        case "jesusdejaelbotytrabaja":
            message.channel.send("voooooooooy ):");
            break; 
            
        default:
            message.channel.send( "repeat plox" );

      }



});


//champion pool,. y separada por lineas 