const strings = require("../../lib/string.json");
const command = require("../../lib/command-info.json");
const General = require("../../commands/knife/general.js");

class DiedCommand extends General {
   	constructor() {
      super("died", {
         aliases: ['d','died'],
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
        	this.loadingMsg.edit(command.died.no_atk.replace('[id]', this.clientID))
        	return
      	}

		await this.dm.setKnifeToDone(id)
		await this.dm.addKnifeCount(this.clientID, this.clientName, 0.5)
		let data = await this.dm.setBossDied(this.boss)
		if(!data){
			this.loadingMsg.edit(command.died.error)
			return
		}

      	this.loadingMsg.edit(command.died.boss_fainted.replace('[boss]', this.boss))

      	this.client.emit("reportUpdate", message.guild);
      	this.client.emit("logUpdate", message.guild, command.died.log.replace('[boss]', this.boss));
      	this.client.emit("memberUpdate", message.guild);

      	return;
   };

}
module.exports = DiedCommand;

