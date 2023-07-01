const strings = require("../../lib/string.json");
const command = require("../../lib/command-info.json");
const General = require("../../commands/knife/general.js");

class BossCommand extends General {
   	constructor() {
      	super("boss", {
         	aliases: ['b','boss'],
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
               		id: "hp",
               		type: "integer",
               		prompt: {
                  		start: strings.prompt.hp,
                  		retry: strings.not_a_number,
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
      	const hp = args.hp;

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
        	this.loadingMsg.edit(command.boss.no_atk.replace('[id]', this.clientID))
        	return
      	}

		await this.dm.setKnifeToDone(id)
		await this.dm.addKnifeCount(this.clientID, this.clientName, 1)
		let data = await this.dm.setBossHp(this.boss, hp)
		if(data.status == "died"){
			this.loadingMsg.edit(command.boss.died.replace('[id]', this.clientID).replace('[boss]', this.boss).replace('[week]', data.week))
		}else if(data.status == "damage"){
			this.loadingMsg.edit(command.boss.damage.replace('[id]', this.clientID).replace('[boss]', this.boss).replace('[hp]', hp).replace('[left_hp]', data.hp))
		}else{
			this.loadingMsg.edit(command.boss.error)
			return
		}
		
      	this.client.emit("reportUpdate", message.guild);
      	this.client.emit("logUpdate", message.guild, command.boss.log.replace('[member]', this.clientName).replace('[boss]', this.boss).replace('[hp]', hp));
      	this.client.emit("memberUpdate", message.guild);
      	return;
   };

}
module.exports = BossCommand;

