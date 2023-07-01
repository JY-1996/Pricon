const strings = require("../../lib/string.json");
const command = require("../../lib/command-info.json");
const General = require("../../commands/knife/general.js");

class CancelAttackCommand extends General {
  constructor() {
      super("cancelAttack", {
         aliases: ['ca','cancelAtk'],
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
   var result = await super.exec(message,args)
      if(result == -1) { return }

	let knifeQuery = await this.dm.getAllKnifeAtkQuery()
    let hasKnife = false
    let id = ""
    if(!knifeQuery.empty){
      	knifeQuery.forEach(doc => {
			let data = doc.data()
      		if(data.boss == this.boss){
      			hasKnife = true
      			id = doc.id
    		}
    	})
    }

	if(!hasKnife){
        this.loadingMsg.edit(command.cancel_atk.no_reserve.replace('[id]', this.clientID))
        return
    }
    await this.dm.setKnifeToProcessing(id)
    
    this.loadingMsg.edit(command.cancel_atk.cancel.replace('[id]', this.clientID).replace('[boss]', this.boss))

    this.client.emit("reportUpdate", message.guild);
    this.client.emit("logUpdate", message.guild,command.atk.log.replace('[member]', this.clientName).replace('[boss]', this.boss));

    return
  }

}
module.exports = CancelAttackCommand;