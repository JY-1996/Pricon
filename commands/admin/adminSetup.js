const { Command } = require("discord-akairo");
const { Permissions } = require('discord.js');
const strings = require("../../lib/string.json");
const admin = require("../../lib/admin.json");

class AdminSetupCommand extends Command {
   constructor() {
      super('adminSetup', {
         aliases: ['setup','重置'],
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

  //  async userPermissions(member) {
  //     return SettingsManager.checkMember(member);
  //  }

   async exec(message, args) {
      const guildID = message.guild.id
      const clientID = message.author.id
      const db = this.client.db
      
      let loadingMsg = await message.channel.send(strings.common.waiting);

      
      let serverRef = db.collection('servers').doc(guildID)
      let server = await serverRef.get()
      if(server.exists){
        await loadingMsg.edit(admin.setup.repeat)
        return
      }
      await loadingMsg.edit(admin.setup.repeat)
      return
    }
    
 
}
module.exports = AdminSetupCommand;

