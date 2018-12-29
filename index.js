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

function hasModPerms(mess) {
  if (mess.member.hasPermission("KICK_MEMBERS")) {
    return true
  } else {
    return false
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
    mess = msg.content.toLowerCase().split(" ");
    if (mess[0] == "-createrole") {
      mess.shift()
      for (var i = 0; i < mess.length; i++) {
        if (mess[i].charAt(0) == "<" && mess[i].charAt(1) == "@") {
          mess.splice(i, 1)
          i = i - 1
        }
      }
      msg.guild.createRole({
        name: mess,
        mentionable: true
      }).then(role => msg.mentions.members.array()[0].addRole(newrole)).then(role => msg.mentions.members.array()[0].addRole(newrole)).catch(console.error);
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
        role = msg.mentions.roles.array()[0].name
        msg.guild.createChannel(mess.join(" ")).then(channel => chan = channel)
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
          name: mess.join(" "),
          role: role
        })
        console.log(mess)
        console.log(msg.content);
        fs.writeFileSync("./stuff.json", JSON.stringify(stuff))
      }
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
