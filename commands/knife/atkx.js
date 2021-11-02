const strings = require("../../lib/string.json");
const command = require("../../lib/command-info.json");
const General = require("../../commands/knife/general.js");

class AtkXCommand extends General {
   constructor() {
      super("atkx", {
         aliases: ['ax','atkx'],
         cooldown: 3000,
         channel: 'guild',
         args: [
            {
              id: "boss",
              type: "integer",
              prompt: {
                start: strings.prompt.boss,
                retry: strings.prompt.not_a_number,
              },
            },
            {
              id: "member",
              type: "memberMention",
            }
         ],
      });
   };

   async exec(message, args) {
    await super.exec(message,args)

    let knifeQuery = await this.dm.getAllKnifeQuery()
    let hasKnife = false
    let id = ""
    if(!knifeQuery.empty){
      await knifeQuery.forEach(doc => {
      if(doc.data().boss == this.boss){
          hasKnife = true
          id = doc.id
          if(doc.data().status == 'attacking'){
            this.dm.setKnifeToProcessing(doc.id)
          }
        }
      })
    }

    if(!hasKnife){
      await this.dm.setKnife(Date.now(),{
          boss: this.boss,
          comment: '',
          time: Date.now(),
          member:  this.clientName,
          member_id: this.clientID,
          status: 'attacking'
      })
    }else{
      await this.dm.setKnifeToAtk(id)
    }

    this.loadingMsg.edit(command.atk.attack.replace('[id]', this.clientID).replace('[boss]', this.boss))

    this.client.emit("reportUpdate", message.guild)
    this.client.emit("logUpdate", message.guild,command.atk.log.replace('[member]', this.clientName).replace('[boss]', this.boss))
    return
   };

}
module.exports = AtkXCommand;