const { Command } = require("discord-akairo");
const { Permissions } = require('discord.js');
const strings = require("../../lib/string.json");
const admin = require("../../lib/admin.json");
const NewDatabaseManager  = require("../../classes/NewDatabaseManager");

class AdminFailCommand extends Command {
   constructor() {
      super('adminFail', {
         aliases: ['f','fail'],
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
      const guildID = message.guild.id
      const clientID = message.author.id
      const db = this.client.db
      const dm = new NewDatabaseManager(db,guildID)
      
      let loadingMsg = await message.channel.send(strings.common.waiting);

      let list = await dm.tagFailMember()
      let text = ""
      list.forEach(doc => {
        text += "<@" + doc.id + ">\n"
      })
      text += "请尽快出完刀"
      await loadingMsg.edit(text);
      return
    }
    
 
}
module.exports = AdminFailCommand;

