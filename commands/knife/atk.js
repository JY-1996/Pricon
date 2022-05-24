// const strings = require("../../lib/string.json");
// const command = require("../../lib/command-info.json");
// const General = require("../../commands/knife/general.js");

// class AtkCommand extends General {
//   constructor() {
//       super("atk", {
//          aliases: ['a','atk'],
//          cooldown: 3000,
//          channel: 'guild',
//          args: [
//             {
//               id: "boss",
//               type: "integer",
//               prompt: {
//                 start: strings.prompt.boss,
//                 retry: strings.prompt.not_a_number,
//               },
//             },
//             {
//               id: "member",
//               type: "memberMention",
//             }
//          ],
//       });
//    };

//   async exec(message, args) {
//     await super.exec(message,args)

//     let knifeQuery = await this.dm.getAllKnifeProcessingAtkQuery()
//     let hasKnife = false
//     let id = ""
//     if(!knifeQuery.empty){
//       knifeQuery.forEach(doc => {
//       if(doc.data().boss == this.boss){
//           hasKnife = true
//           id = doc.id
//         }
//       })

//       if(!hasKnife){
//         this.loadingMsg.edit(command.atk.no_reserve.replace('[id]', this.clientID))
//         return
//       }
//     }
	
// 	let min = await this.dm.checkAtkAvailable(this.boss)
// 	if(!min){
// 		this.loadingMsg.edit(command.atk.cannot_atk.replace('[id]', this.clientID))
// 		return 
// 	}

//     await this.dm.setKnifeToAtk(id)
    
//     this.loadingMsg.edit(command.atk.attack.replace('[id]', this.clientID).replace('[boss]', this.boss))

//     this.client.emit("reportUpdate", message.guild);
//     this.client.emit("logUpdate", message.guild,command.atk.log.replace('[member]', this.clientName).replace('[boss]', this.boss));

//     return
//   }

// }
// module.exports = AtkCommand;