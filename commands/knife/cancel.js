const strings = require("../../lib/string.json");
const command = require("../../lib/command-info.json");
const General = require("../../commands/knife/general.js");

class CancelCommand extends General {
   	constructor() {
      	super("cancel", {
         	aliases: ['c','cancel'],
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
      		knifeQuery.forEach(doc => {
				let data = doc.data()
      			if(data.boss == this.boss && data.status != 'done'){
          			hasKnife = true
          			id = doc.id
        		}
      		})
    	}

		if(!hasKnife){
        	this.loadingMsg.edit(command.cancel.no_reserve.replace('[id]', this.clientID))
        	return
      	}

		await this.dm.deleteKnife(id)
		  
      	this.loadingMsg.edit(command.cancel.cancel_reserve.replace('[id]', this.clientID));
      	this.client.emit("reportUpdate", message.guild);
      	this.client.emit("logUpdate", message.guild, command.cancel.log.replace('[member]', this.clientName));
      	return
   };

}
module.exports = CancelCommand;

