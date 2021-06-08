const { Command } = require("discord-akairo");
const { Permissions } = require('discord.js');
const strings = require("../../lib/string.json");
const admin = require("../../lib/admin.json");

class AdminLogCommand extends Command {
   constructor() {
      super('adminLog', {
         aliases: ['log','指令記錄'],
         cooldown: 3000,
         channel: 'guild',
         userPermissions: Permissions.FLAGS.ADMINISTRATOR,
         args: [
            {
               id: 'compensate',
               match: 'flag',
               flag: ['c','-c','com','-com']
            },
            {
               id: "channel",
               type: "textChannel"
            }
         ],
      });
    };

    async exec(message, args) {
      let loadingMsg = await message.channel.send(strings.common.waiting);

      const db = this.client.db
      const guildID = message.guild.id;
      let channelID = message.channel.id

      const serverQueryRef = this.client.db
         .collection('servers')
         .doc(guildID)
         .collection('setting')
         .doc('log_channel')
      let serverQuery = serverQueryRef.get() 
      if (args.channel) {
          channelID = args.channel.id
      } 
      if(serverQuery.exists){   
          await serverQueryRef.delete()
      }
      await serverQueryRef.set({id: channelID})
      loadingMsg.edit(admin.setup.report.replace("[channel]", `<#${channelID}>`));
      // this.client.emit("logUpdate", message.guild);
    };
}
module.exports = AdminLogCommand;

