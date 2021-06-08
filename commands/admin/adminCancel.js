const { Command } = require("discord-akairo");
const { Permissions } = require('discord.js');
const strings = require("../../lib/string.json");
const admin = require("../../lib/admin.json");

class AdminCancelCommand extends Command {
   constructor() {
      super('adminCancel', {
         aliases: ['ac','admincancel'],
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
             id: "member",
               type: "memberMention",
               prompt: {
                  start: strings.prompt.user,
                  retry: strings.prompt.not_a_member,
               },
            }
         ],
      });
   };

  //  async userPermissions(member) {
  //     return SettingsManager.checkMember(member);
  //  }

   async exec(message, args) {
      const clientID = message.author.id
      const db = this.client.db
      let loadingMsg = await message.channel.send(strings.common.waiting);

      const member = args.member
      
      let knifeRef = db.collection('servers').doc(guildID).collection('knife').doc(member.id)
      let knife = await knifeRef.get()
      if(!knife.exists){
        loadingMsg.edit(admin.cancel.no_reserve.replace('[id]', clientID))
        return
      }
      await knifeRef.delete()
      loadingMsg.edit(admin.cancel.reserve_cancel.replace('[id]', clientID).replace('[member]', member))
      this.client.emit("reportUpdate", message.guild);

      return
    }
    
 
}
module.exports = AdminCancelCommand;

