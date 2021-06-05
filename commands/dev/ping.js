const { Command } = require("discord-akairo");

class PingCommand extends Command {
   constructor() {
      super("ping", {
         aliases: ["ping", "🏓"],
      });
   };

   async exec(message) {


      let initialTime = message.createdTimestamp;
      let sentmsg = await message.channel.send('等候中...');
      let arrivingTime = sentmsg.createdAt;

      let timeDiff = arrivingTime - initialTime;
      sentmsg.edit(`<@` + message.author.id + `>🏓 PONG! 延遲值：${timeDiff}ms `);
   }
}
module.exports = PingCommand;