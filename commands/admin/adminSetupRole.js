const { Command } = require("discord-akairo");
const { Permissions } = require('discord.js');
const strings = require("../../lib/string.json");
const admin = require("../../lib/admin.json");
const ChannelManager  = require("../../classes/ChannelManager");

class AdminSetupRoleCommand extends Command {
   constructor() {
      super('setuprole', {
         aliases: ['role'],
         cooldown: 3000,
         channel: 'guild',
         userPermissions: Permissions.FLAGS.ADMINISTRATOR,
         args: [
            {
               id: "role",
               type: "role"
            }
         ],
      });
   };

   async exec(message, args) {
      const guildID = message.guild.id
      const clientID = message.author.id
      const db = this.client.db
      const cm = new ChannelManager(db,guildID,clientID)
      
      let loadingMsg = await message.channel.send(strings.common.waiting);

      const detail = await cm.setRoleId(args.role.id)
      
      loadingMsg.edit(admin.member.title);

      return
    }
    
 
}
module.exports = AdminSetupRoleCommand;

