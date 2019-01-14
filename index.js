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
var weather = require('weather-js');
const streamOptions = {
  seek: 0,
  volume: 1
};
const ffmpeg = require("ffmpeg")
const SQLite = require("better-sqlite3");
const sql = new SQLite('./scores.sqlite');
var stuff = JSON.parse(fs.readFileSync("./stuff.json"))
const toHex = require("colornames")
const notes = [{
  title: "Command List",
  desc: "Add a command list (-commands) for people new with the bot",
  type: "addition"
}, {
  title: "Kick",
  desc: "Make a kick command (-kick) for removing members",
  type: "addition"
}, {
  title: "Ban",
  desc: "Make a ban command (-ban) for pernamently removing members",
  type: "addition"
}, {
  title: "Fun Command",
  desc: "Add stuff (-roll, -gamble, -8ball) for entertainment",
  type: "addition"
}, {
  title: "Economy",
  desc: "Economy life. like working and getting money and viewing account and balance and daily rewards and store to buy stuff.",
  type: "addition"
}, {
  title: "-deletechannel",
  desc: "Fix errors with -deletechannel",
  type: "moderate"
}, {
  title: "Add Embeds",
  desc: "Make more commands embedded messages",
  type: "minor"
}, {
  title: "Implement the #logs and #removal-logs",
  desc: "u know what i mean lol",
  type: "addition"
}]
const map = {
  minor: toHex("green"),
  moderate: toHex("orange"),
  major: toHex("salmon"),
  bug: toHex("firebrick"),
  addition: toHex("blue")
}
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

function findGuild(id) {
  for (var i = 0; i < client.guilds.array().length; i++) {
    if (client.guilds.array()[i].id == id) {
      return client.guilds.array()[i]
    }
  }
}

function hasModPerms(mess) {
  if (mess.member.hasPermission("KICK_MEMBERS") || mess.author.id == 350930610719817728) {
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
// -weather
client.on('message', msg => {
  if (isOk(msg)) {
    mess = msg.content.toLowerCase().split(" ");
    if (mess[0] == "-weather") {
      mess.shift()
      weather.find({
        search: mess.join(" "),
        degreeType: 'C'
      }, async function(err, result) {
        if (err) console.log(err);
        embed = new Discord.RichEmbed();
        embed.setTitle("Weather for " + mess)
        result = JSON.stringify(result, null, 2)
        stuff.misc.push(result);
        embed.addField("Current Temperature: ", result[0].current.temperature)
        embed.setAuthor(msg.author.username, msg.author.authorURL)
        embed.setColor("BLUE")
        msg.channel.send(embed)
        fs.writeFileSync("./stuff.json", JSON.stringify(stuff))
      });
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
// -mute
client.on('message', msg => {
  if (isOk(msg)) {
    if (hasModPerms(msg))
      mess = msg.content.toLowerCase().split(" ");
    if (mess[0] == "-mute") {
      if (msg.mentions.members.array()) {
        msg.mentions.members.array()[0].addRole(roleFind(msg.guild.roles.array(), 532257549534232586))
      }
    }
  }
});

// -unmute
client.on('message', msg => {
  if (isOk(msg)) {
    if (hasModPerms(msg))
      mess = msg.content.toLowerCase().split(" ");
    if (mess[0] == "-unmute") {
      if (msg.mentions.members.array()) {
        msg.mentions.members.array()[0].removeRole(roleFind(msg.guild.roles.array(), 532257549534232586))
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
    if (hasModPerms(msg)) {
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
        if ((mess.length == 1)) {
          msg.guild.createRole({
            name: mess[0],
            mentionable: true
          }).then(role => {
            console.log(role.name)
            console.log(role.id)
            console.log(".then");
            arry = []
            for (var i = 0; i < msg.mentions.members.array().length; i++) {
              msg.mentions.members.array()[i].addRole(role.id)
              arry.push(msg.mentions.members.array()[i].id)
            }
            console.log("push");
            stuff.roles.push({
              name: role.name,
              id: role.id,
              users: arry
            })
            msg.delete()
            console.log("start embed");
            embed = new Discord.RichEmbed();
            embed.setTitle("Successfully created role")
            embed.addField("Created Role:", role.name)
            embed.setAuthor(msg.author.username, msg.author.authorURL)
            embed.setColor("BLUE")
            embed.setFooter("Made by Jabster28, made for Ramoth")
            msg.channel.send(embed).then(msg => msg.delete(5000))
            console.log("sent");
          }).catch(console.error);
        } else {
          msg.guild.createRole({
            name: mess.join(" "),
            mentionable: true
          }).then(role => {
            console.log(".then");
            arry = []
            for (var i = 0; i < msg.mentions.members.array().length; i++) {
              msg.mentions.members.array()[i].addRole(role.id)
              arry.push(msg.mentions.members.array()[i].id)
            }
            console.log("push");
            stuff.roles.push({
              name: role.name,
              id: role.id,
              users: arry
            })
            msg.delete()
            console.log("start embed");
            embed = new Discord.RichEmbed();
            embed.setTitle("Successfully created role")
            embed.addField("Created Role:", role.name)
            embed.setAuthor(msg.author.username, msg.author.authorURL)
            embed.setColor("BLUE")
            embed.setFooter("Made by Jabster28, made for Ramoth")
            msg.channel.send(embed).then(msg => msg.delete(5000))
            console.log("sent");
          }).catch(console.error);
        }
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
          if (msg.guild.id == 507609315079880722) {
            findChannel(msg.guild, chanid).overwritePermissions(roleFind(msg.guild.roles.array(), 508037227369070603), {
              'SEND_MESSAGES': true,
              'VIEW_CHANNEL': true,
              'READ_MESSAGE_HISTORY': true
            })
            findChannel(msg.guild, chanid).overwritePermissions(roleFind(msg.guild.roles.array(), 525686338381676556), {
              'SEND_MESSAGES': true,
              'VIEW_CHANNEL': true,
              'READ_MESSAGE_HISTORY': true
            })
          }
          stuff.channels.push({
            name: chan.name,
            role: role.id
          })
          msg.delete()
          embed = new Discord.RichEmbed();
          embed.setTitle("Successfully created channel")
          embed.addField("Created Channel:", chan.name)
          embed.setAuthor(msg.author.username, msg.author.authorURL)
          embed.setColor("BLUE")
          embed.setFooter("Made by Jabster28, made for Ramoth")
          msg.channel.send(embed).then(msg => msg.delete(5000)).then(ree => fs.writeFileSync("./stuff.json", JSON.stringify(stuff)))
          console.log(mess)
          console.log(msg.content);

        })
      }
    }
  }
});

// -join
client.on('message', msg => {
  if (isOk(msg)) {
    mess = msg.content.split(" ")
    if (mess[0] == "-join") {
      if (msg.member.voiceChannel) {
        msg.member.voiceChannel.join().then(connection => {
          const stream = ytdl(mess[1], {
            filter: 'audioonly'
          });
          const dispatcher = connection.playStream(stream, streamOptions);
          msg.channel.send("Successfully joined the channel")
        })
      } else if (!(msg.member.voiceChannel.joinable)) {
        msg.channel.send("Hmm, I can't access this channel. Please tell the server owner about this")
      } else
        msg.channel.send("Sorry, but you must be in a Voice Channel to use that! Why not join one?")
    };

  }
});

// -leave
client.on('message', msg => {
  if (isOk(msg)) {
    if (msg.content.toLowerCase() == "-leave") {
      if (msg.guild.me.voiceChannel) {
        msg.guild.me.voiceChannel.leave();
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
        if (arrayObjFindByName(stuff.channels, msg.mentions.channels.array()[0].name)) {
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
        } else {
          msg.mentions.channels.array()[0].delete().then(channel => {
            msg.delete()
            embed = new Discord.RichEmbed();
            embed.setTitle("Successfully deleted channel")
            embed.addField("Deleted Channel:", channame)
            embed.setAuthor(msg.author.username, msg.author.authorURL)
            embed.setColor("BLUE")
            embed.setFooter("Made by Jabster28, made for Ramoth")
            msg.channel.send(embed).then(msg => msg.delete(5000))
          })
        }
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
        embed.setTitle(generateRandomNumber(mess[1]) + "!");
        embed.setFooter(mess[1] + "-sided dice rolled.")
        msg.channel.send(embed)
      } else {
        embed = new Discord.RichEmbed();
        embed.setAuthor("Is rolling a Dice...", msg.author.avatarURL)
        embed.setColor("BLUE")
        embed.setTitle(generateRandomNumber(6) + "!");
        embed.setFooter("6-sided dice rolled.")
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
// -devnotes
client.on('message', msg => {
  if (isOk(msg)) {
    if (msg.content.toLowerCase() == "-devnotes") {
      console.log("devnotes");
      for (var i = 0; i < notes.length; i++) {
        console.log("for loop");
        note = notes[i]
        embed = new Discord.RichEmbed();
        embed.setTitle(note.title)
        embed.setDescription(note.desc)
        embed.setColor(map[note.type])
        embed.setFooter(note.type)
        msg.channel.send(embed)
      }
    }
  }
});


// -ban
client.on('message', msg => {
  if (isOk(msg)) {
    if (hasModPerms(msg)) {
      mess = msg.content.toLowerCase().split(" ");
      if (mess[0] == "-ban") {
        mess.shift()
        for (var i = 0; i < mess.length; i++) {
          if (mess[i].charAt(0) == "<" && mess[i].charAt(1) == "@") {
            mess.splice(i, 1)
            i = i - 1
          }
        }
        msg.mentions.members.array()[0].ban().then(user => {
          msg.delete()
          embed = new Discord.RichEmbed();
          embed.setTitle("Successfully banned user")
          embed.addField("Deleted Channel:", "<@" + user.user.id + ">")
          embed.addField("Reason:", mess.join(" "))
          embed.setAuthor(msg.author.username, msg.author.avatarURL)
          embed.setColor("BLUE")
          embed.setFooter("Made by Jabster28, made for Ramoth")
          stuff.banned.push({
            name: user.user.name,
            id: user.user.id,
            reason: mess.join(" ")
          })
          msg.channel.send(embed).then(msg => msg.delete(5000))
        })
        fs.writeFileSync("./stuff.json", JSON.stringify(stuff))
      }
    }
  }
})
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

io.action('tth', (cb) => {
  for (var i = 0; i < findGuild(507609315079880722).channels.array().length; i++) {
    console.log("for loop");
    chan = findGuild(507609315079880722).channels.array()[i]
    if (chan.type == "category") {
      console.log("cat");
      chan.overwritePermissions(roleFind(chan.guild.roles.array(), 532257549534232586), {
          SEND_MESSAGES: false,
          SPEAK: false
        }).then(updated => console.log(updated.permissionOverwrites.get(roleFind(chan.guild.roles.array(), 532257549534232586))))
        .catch(console.error);
    }
  }
  cb("Completed.");
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
