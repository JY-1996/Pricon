const { Command } = require("discord-akairo");
const { Permissions } = require('discord.js');
const strings = require("../../lib/string.json");
const admin = require("../../lib/admin.json");

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
      let loadingMsg = await message.channel.send(strings.common.waiting);

      const db = this.client.db
      const guildID = message.guild.id;

      let channelID = message.channel.id

      const serverQueryRef = this.client.db
         .collection('servers')
         .doc(guildID)
         .collection('setting')
         .doc('knife_channel')
      let serverQuery = await serverQueryRef.get() 
      if (args.channel) {
          channelID = args.channel.id
      } 
      if(serverQuery.exists){
          await serverQueryRef.delete();
      }
      await serverQueryRef.set({id: channelID});
      
      loadingMsg.edit(admin.setup.knife.replace("[channel]", `<#${channelID}>`));
    };
}
module.exports = AdminKnifeCommand;

