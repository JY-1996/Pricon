const { Command } = require("discord-akairo");
const Prompter = require('discordjs-prompter');
class PingCommand extends Command {
   constructor() {
      super("ping", {
         aliases: ["ping", "🏓"],
      });
   };

   async exec(message) {

  const response = await Prompter.choice(message.channel, {
    question: 'Pick an emoji!',
    choices: ['✨', '❌'],
    userId: message.author.id
  });
  console.log(response);
      // let initialTime = message.createdTimestamp;
      // let sentmsg = await message.channel.send('等候中...');
      // let arrivingTime = sentmsg.createdAt;

      // let timeDiff = arrivingTime - initialTime;
      // sentmsg.edit(`<@` + message.author.id + `>🏓 PONG! 延遲值：${timeDiff}ms `);
   }
}
module.exports = PingCommand;