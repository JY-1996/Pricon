const { Command } = require("discord-akairo");
const { Permissions } = require('discord.js');
const strings = require("../../lib/string.json");
const admin = require("../../lib/admin.json");
const DatabaseManager  = require("../../classes/DatabaseManager");

class AdminSetupCommand extends Command {
   constructor() {
      super('adminReset', {
         aliases: ['reset','重置'],
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
      const dm = new DatabaseManager(db,guildID)

      let loadingMsg = await message.channel.send(strings.common.waiting);
      await dm.deleteGuildKnife(guildID)
      loadingMsg.edit(admin.reset.title)
      return
    }
    
 
}
module.exports = AdminSetupCommand;

