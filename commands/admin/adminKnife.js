const { Command } = require("discord-akairo");
const { Permissions } = require('discord.js');
const strings = require("../../lib/string.json");
const admin = require("../../lib/admin.json");
const DatabaseManager  = require("../../classes/DatabaseManager");
const { MessageEmbed } = require('discord.js');

class AdminKnifeCommand extends Command {
   constructor() {
      super('adminKnife', {
         aliases: ['knife','報刀頻道'],
         cooldown: 3000,
         channel: 'guild',
         userPermissions: Permissions.FLAGS.ADMINISTRATOR,
         args: [
            {
               id: 'compensate',
               match: 'flag',
               flag: ['c','-c','com','-com']
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
      await dm.setKnifeChannel(channelID)
      const boardChannel = this.client.util.resolveChannel(channelID, message.guild.channels.cache); 
       const embed = new MessageEmbed();
      embed.setColor("#90ffff");
      embed.setTitle(admin.setup.knife.replace("[channel]", boardChannel.name));
      loadingMsg.delete()
      await message.channel.send(embed);
      // loadingMsg.edit(admin.setup.knife.replace("[channel]", `<#${channelID}>`));
    };
}
module.exports = AdminKnifeCommand;

