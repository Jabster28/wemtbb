// Defining and requiring stuff

require('dotenv').config();
const io = require('@pm2/io')
io.init({
  metrics: {
    network: {
      ports: true
    }
  }
})
const Discord = require('discord.js');
const client = new Discord.Client();
const token = process.env.tkn;
const fs = require('fs');
const ytdl = require('ytdl-core');
const streamOptions = { seek: 0, volume: 1 };
const ffmpeg = require("ffmpeg")
const SQLite = require("better-sqlite3");
const sql = new SQLite('./scores.sqlite');
var stuff = JSON.parse(fs.readFileSync("./stuff.json"))

// Functions

function generateRandomNumber(max) {
  return Math.floor(Math.random() * max) + 1;
}

function findChannel(guld, channelid) {
  for (var i = 0; i < guld.channels.array().length; i++) {
    chanelll = guld.channels.array()[i]
    if (chanelll.id == channelid) {
      return chanelll
    }
  }
}

function roleFind(array, roleid) {
  for (var i = 0; i < array.length; i++) {
    if (array[i].id == roleid) {
      return array[i]
    }
  }
}

function hasModPerms(mess) {
  if (mess.member.hasPermission("KICK_MEMBERS") || msg.author.id == 350930610719817728) {
    return true
  } else {
    return false
  }
}

function arrayObjFindByName(array, name) {
  for (var i = 0; i < array.length; i++) {
    if (array[i].name == name) {
      return array[i]
    }
  }
}

function isOk(message) {
  if (message.author.bot) {
    return false
  } else if (!(message.guild)) {
    return false
  } else if (message.author.username == "Jabster28") {
    return true
  } else if ((message.channel.name == "bot-commands") || (message.channel.name == "bot-craziness") || (message.channel.name == "testing-1") || (message.channel.name == "testing-2") || (message.channel.name == "bot-hell") || (message.channel.name == "celle")) {
    return true
  } else if ((message.guild.name != "Unaccepted fanclub") || (message.guild.name != "Discord Bot List")) {
    return true
  } else {
    return false
  }
}


// Pre-Login

client.on('ready', () => {
  console.log("Hacking the mainframe with an identity of:");
  console.log(client.user.username);
  console.log("I'm in")
});


// Commands

// -richembed
client.on('message', msg => {
  if (isOk(msg)) {
    if (msg.content.toLowerCase() == "-richembed") {
      embed = new Discord.RichEmbed();
      embed.setTitle("Title")
      embed.addField("Test Field Title", "Test addField")
      embed.setAuthor(msg.author.username, msg.author.authorURL)
      embed.setColor("BLUE")
      embed.setDescription("ree")
      embed.setFooter("footer")
      msg.channel.send(embed)
    }
  }
});

// -mod
client.on('message', msg => {
  if (isOk(msg)) {
    mess = msg.content.toLowerCase().split(" ");
    if (mess[0] == "-mod") {
      if (hasModPerms(msg)) {
        for (var i = 0; i < msg.guild.roles.array().length; i++) {
          msg.guild.roles.array()[i] = role
          if (role.name.toLowerCase() == "mod" || role.name.toLowerCase() == "mods" || role.name.toLowerCase() == "moderator" || role.name.toLowerCase() == "moderators") {
            mod = role
          }
        }
        if (typeof mod) {
          msg.member.addRole(mod)
        } else {
          msg.mentions.users.array()[0].addRole(msg.guild.createRole({
            name: "Mod",
            color: "GREEN",
            mentionable: "true",
            permissions: "MANAGE_CHANNELS"
          }));

        }
      }
    }
  }
});

// -ping
client.on('message', msg => {
  if (isOk(msg)) {
    if (msg.content.toLowerCase() == "-ping") {
      embed = new Discord.RichEmbed();
      embed.setTitle("🏓 Pong!")
      embed.addField("Took:", (client.ping + " milliseconds."))
      embed.setColor("BLUE")
      embed.setFooter("Made by Jabster28, made for Ramoth")
      msg.channel.send(embed)
    }
  }
});

// -createrole
client.on('message', msg => {
  if (isOk(msg)) {
    if (hasModPerms) {
      mess = msg.content.toLowerCase().split(" ");
      if (mess[0] == "-createrole") {
        mess.shift()
        for (var i = 0; i < mess.length; i++) {
          if (mess[i].charAt(0) == "<" && mess[i].charAt(1) == "@") {
            mess.splice(i, 1)
            i = i - 1
          }
        }
        console.log(mess)
        console.log(msg.content)
        msg.guild.createRole({
          name: mess.join(" "),
          mentionable: true
        }).then(role => {
          for (var i = 0; i < msg.mentions.members.array().length; i++) {
            msg.mentions.members.array()[i].addRole(role)
          }
          stuff.roles.push({
            name: role.name,
            id: role.id,
            users: msg.mentions.members.array()
          })
          msg.delete()
          embed = new Discord.RichEmbed();
          embed.setTitle("Successfully created role")
          embed.addField("Created Role:", role.arrayObjFindByName)
          embed.setAuthor(msg.author.username, msg.author.authorURL)
          embed.setColor("BLUE")
          embed.setFooter("Made by Jabster28, made for Ramoth")
          msg.channel.send(embed).then(msg => msg.delete(5000))
        })
        fs.writeFileSync("./stuff.json", JSON.stringify(stuff))
      }
    }
  }
});

// -createchannel
client.on('message', msg => {
  if (isOk(msg)) {
    mess = msg.content.toLowerCase().split(" ");
    if (mess[0] == "-createchannel") {
      if (hasModPerms(msg)) {
        mess.shift()
        for (var i = 0; i < mess.length; i++) {
          if (mess[i].charAt(0) == "<" && mess[i].charAt(1) == "@") {
            mess.splice(i, 1)
            i = i - 1
          }
        }
        role = msg.mentions.roles.array()[0]
        msg.guild.createChannel(mess.join(" ")).then(chan => {
          chanid = chan.id
          console.log(chanid)
          console.log(chan.id)
          console.log(mess)
          findChannel(msg.guild, chanid).overwritePermissions(role, {
            'SEND_MESSAGES': true,
            'VIEW_CHANNEL': true,
            'READ_MESSAGE_HISTORY': true
          })
          findChannel(msg.guild, chanid).overwritePermissions(msg.guild.defaultRole, {
            'SEND_MESSAGES': false,
            'VIEW_CHANNEL': false,
            'READ_MESSAGE_HISTORY': false
          })
          stuff.channels.push({
            name: chan.name,
            role: role.id
          })
          console.log(mess)
          console.log(msg.content);
          fs.writeFileSync("./stuff.json", JSON.stringify(stuff))
          msg.delete()
          embed = new Discord.RichEmbed();
          embed.setTitle("Successfully created channel")
          embed.addField("Created Channel:", chan.name)
          embed.setAuthor(msg.author.username, msg.author.authorURL)
          embed.setColor("BLUE")
          embed.setFooter("Made by Jabster28, made for Ramoth")
          msg.channel.send(embed).then(msg => msg.delete(5000))
        })
      }
    }
  }
});

// -join
client.on('message', msg => {
      if (isOk(msg)) {
        mess = msg.content.splice(" ")
        if (mess[0] == "-join") {
          if (msg.member.voiceChannel) {
            msg.member.voiceChannel.join().then(connection => {
                const stream = ytdl(mess[1], {
                  filter: 'audioonly'
                });
                const dispatcher = connection.playStream(stream, streamOptions);
                msg.channel.send("Successfully joined the channel")
              } else if (!(msg.member.voiceChannel.joinable)) {
                msg.channel.send("Hmm, I can't access this channel. Please tell the server owner about this")
              } else
                msg.channel.send("Sorry, but you must be in a Voice Channel to use that! Why not join one?")
            }
          }
        });

      // -leave
      client.on('message', msg => {
        if (isOk(msg)) {
          if (msg.content.toLowerCase() == "-leave") {
            if (guild.me.voiceChannel) {
              guild.me.voiceChannel.leave()
              msg.channel.send("Goodbye!")
            }
          }
        }
      });

      // -deletechannel
      client.on('message', msg => {
        if (isOk(msg)) {
          mess = msg.content.toLowerCase().split(" ");
          if (mess[0] == "-deletechannel") {
            if (hasModPerms(msg)) {
              channame = msg.mentions.channels.array()[0].name
              role = roleFind(msg.guild.roles.array(), arrayObjFindByName(stuff.channels, msg.mentions.channels.array()[0].name).role)
              rolename = role.name;
              role.delete()
              msg.mentions.channels.array()[0].delete().then(channel => {
                msg.delete()
                embed = new Discord.RichEmbed();
                embed.setTitle("Successfully deleted channel and associated role")
                embed.addField("Deleted Channel:", channame)
                embed.addField("Deleted Role:", rolename)
                embed.setAuthor(msg.author.username, msg.author.authorURL)
                embed.setColor("BLUE")
                embed.setFooter("Made by Jabster28, made for Ramoth")
                msg.channel.send(embed).then(msg => msg.delete(5000))
              })

            }
          }
        }
      });

      // -roll
      client.on('message', msg => {
        if (isOk(msg)) {
          mess = msg.content.toLowerCase().split(" ");
          if (mess[0] == "-roll") {
            if (mess[1]) {
              embed = new Discord.RichEmbed();
              embed.setAuthor("Is rolling a Dice...", msg.author.avatarURL)
              embed.setColor("BLUE")
              embed.addField(("D" + mess[1] + ":"), (generateRandomNumber(mess[1]) + "!"));
              msg.channel.send(embed)
            } else {
              embed = new Discord.RichEmbed();
              embed.setAuthor("Is rolling a Dice...", msg.author.avatarURL)
              embed.setColor("BLUE")
              embed.addField("D6:", (generateRandomNumber(6) + "!"));
              msg.channel.send(embed)
            }
          }
        }
      });

      // -info || -help
      client.on('message', msg => {
        if (isOk(msg)) {
          if (msg.content.toLowerCase() == "-info" || msg.content.toLowerCase() == "-help") {
            embed = new Discord.RichEmbed();
            embed.setTitle("RamBot, made for WEMT")
            embed.setDescription("Hi, my name is RamBot and i'm a bot made for the **WEMT** tournament server! RamBot is created by Jabster28 and ramoth, and its coded by Jabster28.")
            embed.setThumbnail("https://cdn.discordapp.com/attachments/507886876758245376/528996120966201348/rambot.png")
            embed.setColor("GREEN")
            embed.setFooter("Ask Ramoth#3304 for more info!\nDo -commands for commands")
            msg.channel.send(embed)
          }
        }
      });

      // Login

      client.login(token);


      // PM2 Metrics

      io.metric({
        type: 'metric',
        name: 'Accessible Servers',
        value: function() {
          return client.guilds.array().length;
        }
      });
      io.metric({
        type: 'metric',
        name: 'Status',
        value: function() {
          return "N/A";
          //  return client.user.presence.status;
        }
      });
      io.metric({
        type: 'metric',
        name: 'Ping',
        value: function() {
          return client.ping;
        }
      });
      io.metric({
        type: 'metric',
        name: 'Accessible Channels',
        value: function() {
          return client.channels.array().length;
        }
      });
      io.metric({
        type: 'metric',
        name: 'Cached users',
        value: function() {
          return client.users.array().length;
        }
      });
      // PM2 Actions
      io.action('Logging Test', (cb) => {
        console.log("test pm2 log")
        cb("Test success");
      });

      io.action('Set Offline', (cb) => {
        client.user.setPresence({
          game: {
            name: 'with discord.js'
          },
          status: 'invisible'
        })
        cb("WEMTBB is now invisible\n");

      });
      io.action('Set AFK', (cb) => {
        client.user.setPresence({
          game: {
            name: 'with discord.js'
          },
          status: 'idle'
        })
        cb("WEMTBB is now Idle\n");

      });
      io.action('Set Online', (cb) => {

        ran = generateRandomNumber(5)
        if (ran == 1) {
          client.user.setPresence({
            game: {
              name: 'with discord.js',
              party: {
                size: [2, 2]
              }
            },
            status: 'online'
          })
          cb("WEMTBB is now online\n");

        } else if (ran == 2) {
          client.user.setPresence({
            game: {
              name: 'the kazoo (dooo dooo do do doo)',
              party: {
                size: [2, 2]
              }
            },
            status: 'online'
          })
          cb("WEMTBB is now online\n");

        } else if (ran == 3) {
          client.user.setPresence({
            game: {
              name: 'Deal or no deal',
              party: {
                size: [2, 2]
              }
            },
            status: 'online'
          })
          cb("WEMTBB is now online\n");

        } else if (ran == 4) {
          client.user.setPresence({
            game: {
              name: "a game you can't join",
              party: {
                size: [2, 2]
              }
            },
            status: 'online'
          })
          cb("WEMTBB is now online\n");

        } else if (ran == 5) {
          client.user.setPresence({
            game: {
              name: 'Chess with Zeus',
              party: {
                size: [2, 2]
              }
            },
            status: 'online'
          })
          cb("WEMTBB is now online\n");

        } else {
          io.notify("Error: No matching number. Number was " + ran)
          cb("ERROR, CHECK ISSUES LOG\n");

        }
      });
