const { Command } = require("discord-akairo");
const strings = require("../../lib/string.json");
const admin = require("../../lib/admin.json");

class AdminCancelCommand extends Command {
   constructor() {
      super('adminCancel', {
         aliases: ['aC','adminCancel'],
         cooldown: 3000,
         channel: 'guild',
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
      
      let knifeRef = db.collection('knife').doc(member.id)
      let knife = await knifeRef.get()
      if(!knife.exists){
        loadingMsg.edit(admin.cancel.no_reserve.replace('[id]', clientID))
        return
      }
      await knifeRef.delete()
      loadingMsg.edit(admin.cancel.reserve_cancel.replace('[id]', clientID).replace('[member]', member))
      this.client.emit("knifeUpdate", message.guild);

      return
    }
    
 
}
module.exports = AdminCancelCommand;

