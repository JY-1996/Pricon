const { Command } = require("discord-akairo");
const { Permissions } = require('discord.js');
const strings = require("../../lib/string.json");
const admin = require("../../lib/admin.json");
const DatabaseManager  = require("../../classes/DatabaseManager");


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
      const db = this.client.db
      const guildID = message.guild.id;
      const channelID = message.channel.id
      const dm = new DatabaseManager(db,guildID)

      let loadingMsg = await message.channel.send(strings.common.waiting);

      if (args.channel) {
          channelID = args.channel.id
      } 
      await dm.setLogChannel(channelID)
      loadingMsg.edit(admin.setup.report.replace("[channel]", `<#${channelID}>`));
      // this.client.emit("logUpdate", message.guild);
    };
}
module.exports = AdminLogCommand;

