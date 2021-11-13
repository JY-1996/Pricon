const strings = require("../../lib/string.json");
const command = require("../../lib/command-info.json");
const General = require("../../commands/knife/general.js");

class ReserveCommand extends General {
  constructor() {
      super("reserve", {
        aliases: ['r','reserve','預約'],
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
          },
          {
            id: "comment",
            type: "string",
            match: "restContent"
          }
        ],
    });
  };

  async exec(message, args) { 
      await super.exec(message,args)
      
      let comment = ''
      if (args.comment) {
         comment = args.comment;
      }
    
      let count = await this.dm.getKnifeCount()
      if(count >= 3){
        this.loadingMsg.edit(command.reserve.knife_count_exceed.replace('[id]', clientID))
        return
      }

      let knifeQuery = await this.dm.getAllKnifeProcessingAtkQuery()
      let hasKnife = false
      if(!knifeQuery.empty){
        knifeQuery.forEach(doc => {
          if(doc.data().boss == this.boss){
            hasKnife = true
          }
        })

        if(hasKnife){
          this.loadingMsg.edit(command.reserve.repeated.replace('[id]', this.clientID));
          return
        }
      }

      await this.dm.setKnife(Date.now(),{
         boss: this.boss,
         comment: comment,
         time: Date.now(),
         member:  this.clientName,
         member_id: this.clientID,
         status: 'processing'
      })

      this.loadingMsg.edit(command.reserve.reserved.replace('[id]', this.clientID).replace('[boss]', this.boss).replace('[comment]',comment));

      this.client.emit("reportUpdate", message.guild);
      this.client.emit("logUpdate", message.guild,command.reserve.log.replace('[member]', this.clientName).replace('[boss]', this.boss).replace('[comment]', comment));
      return;
  };

}
module.exports = ReserveCommand;

