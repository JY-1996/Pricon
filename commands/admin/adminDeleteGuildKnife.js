const { Command } = require("discord-akairo");
const { Permissions } = require('discord.js');
const strings = require("../../lib/string.json");
const admin = require("../../lib/admin.json");
const AdminManager  = require("../../classes/AdminManager");

class AdminDeleteGuildKnifeCommand extends Command {
   constructor() {
      super('adminReset', {
         aliases: ['reset','重置'],
         cooldown: 3000,
         channel: 'guild',
         userPermissions: Permissions.FLAGS.ADMINISTRATOR
      });
   };

   async exec(message, args) {
       const db = this.client.db
      const guildID = message.guild.id;
      const dm = new AdminManager(db,guildID)

      let loadingMsg = await message.channel.send(strings.common.waiting);
      await dm.deleteGuildKnife(guildID,"knife")
      loadingMsg.edit(admin.reset.title)
      this.client.emit("reportUpdate", message.guild);
      
      return
    }
    
 
}
module.exports = AdminDeleteGuildKnifeCommand;

