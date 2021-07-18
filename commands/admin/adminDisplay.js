const { Command } = require("discord-akairo");
const { Permissions } = require('discord.js');
const strings = require("../../lib/string.json");
const admin = require("../../lib/admin.json");
const AdminManager  = require("../../classes/AdminManager");

class AdminDisplayCommand extends Command {
   constructor() {
      super('adminDisplay', {
         aliases: ['admindisplay'],
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
      const dm = new AdminManager(db,guildID)

      let loadingMsg = await message.channel.send(strings.common.waiting);
      let result = await dm.displayAllSetting()
      let text = ''
      await result.forEach(doc => {
          let json = doc.data()
          for(var k in json) {
              text += k + ' : ' + json[k] + '\n'
          }
      })
      loadingMsg.edit(text);
      return
    }
}
module.exports = AdminDisplayCommand;

