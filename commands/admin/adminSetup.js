const { Command } = require("discord-akairo");
const { Permissions } = require('discord.js');
const strings = require("../../lib/string.json");
const admin = require("../../lib/admin.json");
const help = require("../../lib/helpadmin.json");
const AdminManager  = require("../../classes/AdminManager");

class AdminSetupCommand extends Command {
   constructor() {
      super('adminSetup', {
         aliases: ['start'],
         cooldown: 3000,
         channel: 'guild',
         userPermissions: Permissions.FLAGS.ADMINISTRATOR
      });
   };

   async exec(message, args) {
      const db = this.client.db
      const guildID = message.guild.id;
      const am = new AdminManager(db,guildID)

      let loadingMsg = await message.channel.send(strings.common.waiting);
      await am.setupGuildSetting(message.guild.name)
      loadingMsg.edit(admin.setup.init)
      return
    }
    
 
}
module.exports = AdminSetupCommand;

