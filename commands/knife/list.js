const strings = require("../../lib/string.json");
const command = require("../../lib/command-info.json");
const General = require("../../commands/knife/general.js");

class ListCommand extends General {
   	constructor() {
      	super("list", {
         	aliases: ['l','list'],
         	cooldown: 3000,
         	channel: 'guild',
         	args: [
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
    	if(knifeQuery.empty){
			this.loadingMsg.edit(command.list.no_reserve.replace('[id]', this.clientID));
        	return
		}

		let text = ""
      	knifeQuery.forEach(doc => {
			let data = doc.data()
			text += data.boss + "王"
            if(data.status == "done"){
               	text += "\t已出刀"
            }else{
               	text += "\t预约中。。。"
            }

            if(data.compensate){
               	text += "(0.5刀)\n"
            }else{
               	text += "(1刀)\n"
            }
      	})
		
      	this.loadingMsg.edit(text);
      	return
   };

}
module.exports = ListCommand;

