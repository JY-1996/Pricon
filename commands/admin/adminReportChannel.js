const { Command } = require("discord-akairo");
const { Permissions } = require('discord.js');
const strings = require("../../lib/string.json");
const admin = require("../../lib/admin.json");
const ChannelManager  = require("../../classes/ChannelManager");


class AdminReportChannelCommand extends Command {
   constructor() {
      super('adminReport', {
         aliases: ['report','報刀表'],
         cooldown: 3000,
         channel: 'guild',
         userPermissions: Permissions.FLAGS.ADMINISTRATOR,
         args: [
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
      let channelID = message.channel.id
      const dm = new ChannelManager(db,guildID)

      let loadingMsg = await message.channel.send(strings.common.waiting);

      if (args.channel) {
          channelID = args.channel.id
      } 
      await dm.setReportChannel(channelID)
      
      loadingMsg.edit(admin.setup.report.replace("[channel]", `<#${channelID}>`));
      this.client.emit("reportUpdate", message.guild);
    };
}
module.exports = AdminReportChannelCommand;

