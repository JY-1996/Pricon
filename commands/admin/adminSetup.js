const { Command } = require("discord-akairo");
const { Permissions } = require('discord.js');
const strings = require("../../lib/string.json");
const admin = require("../../lib/admin.json");
const AdminManager  = require("../../classes/AdminManager");

class AdminSetupCommand extends Command {
   constructor() {
      super('adminSetup', {
         aliases: ['setup','初始化'],
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
      await am.setupGuildSetting()
      loadingMsg.edit(admin.setup.init)
      return
    }
    
 
}
module.exports = AdminSetupCommand;

