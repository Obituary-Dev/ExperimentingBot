//---------------start command with ! ------------------

// require the discord.js module
const Discord = require("discord.js");

const fs = require("fs");

// get config.json content and store it in each
const { prefix, token } = require("./config.json");

// create a new Discord client
const client = new Discord.Client();
client.commands = new Discord.Collection();

// The fs.readdirSync() method will return an array of all the file names in that directory, e.g. ['ping.js', 'beep.js']
// With that array, you can loop over it and dynamically set your commands to the Collection above.
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}


// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once("ready", () => {
  console.log("Ready!");
});

// client.on means that it can trigger multiple times
client.on("message", (message) => {
  console.log(message.content);
});
client.on("message", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === "ping") {
    //message.channel.send("Pong.");
    client.commands.get('ping').execute(message, args);
  } else if (command === "boop") {
    client.commands.get('boop').execute(message, args);
  } else if (command === "server") {
    client.commands.get('server').execute(message, args);
  } else if (command === "user-info") {

    
  } else if (command === "info") {
    if (!args.length) {
      return message.channel.send(
        `You didn't provide any arguments, ${message.author}!`
      );
    } else if (args[0] === "test") {
      return message.channel.send(
        "You want to test me?"
      );
    }
    message.channel.send(`First argument: ${args[0]}`);
  } else if (command === "prune") {
    const amount = parseInt(args[0]) + 1;

    if (isNaN(amount)) {
      return message.reply("that doesn't seem to be a valid number.");
    } else if (amount <= 1 || amount > 100) {
      return message.reply("you need to input a number between 1 and 99.");
    }

    message.channel.bulkDelete(amount, true).catch((err) => {
      console.error(err);
      message.channel.send(
        "there was an error trying to prune messages in this channel!"
      );
    });
  }
});

// login to Discord with your app's token
client.login(token);
