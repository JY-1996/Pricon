const { Command } = require("discord-akairo");
const { Permissions } = require('discord.js');
const strings = require("../../lib/string.json");
const admin = require("../../lib/admin.json");
const AdminManager  = require("../../classes/AdminManager");

class AdminKnifeCountCommand extends Command {
   constructor() {
      super('knifeCount', {
         aliases: ['kc','knifecount'],
         cooldown: 3000,
         channel: 'guild',
         userPermissions: Permissions.FLAGS.ADMINISTRATOR,
         args: [
            {
               id: 'compensate',
               match: 'flag',
               flag: ['c','-c','com','-com']
            },
            {
               id: "count",
               type: "integer",
               prompt: {
                  start: strings.prompt.knife,
                  retry: strings.prompt.not_a_number,
               },
            }
         ],
      });
   };

   async exec(message, args) {
      const guildID = message.guild.id
      const clientID = message.author.id
      const db = this.client.db
      const dm = new AdminManager(db,guildID,clientID)
      
      let loadingMsg = await message.channel.send(strings.common.waiting);

      const detail = await dm.setKnifeCount(args.count)
      
      loadingMsg.edit(admin.knifeCount.title + ' => ' + args.count);

      this.client.emit("reportUpdate", message.guild);

      return
    }
    
 
}
module.exports = AdminKnifeCountCommand;

