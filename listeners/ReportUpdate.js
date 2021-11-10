const { Listener } = require('discord-akairo')
const UtilLib = require("../api/util-lib")
const DatabaseManager = require("../classes/DatabaseManager");
const NewDatabaseManager = require("../classes/NewDatabaseManager");
const ChannelManager = require("../classes/ChannelManager");

class ReportUpdateListener extends Listener { 
  constructor() {
      super('reportupdate', {
         emitter: 'client',
         event: 'reportUpdate'
      });
   }

   async exec(guild) {
    const db = this.client.db
    const guildID = guild.id
    const dm = new NewDatabaseManager(db, guildID)
	const d = new DatabaseManager(db, guildID)
    const cm = new ChannelManager(db, guildID)

    let tableText = ''
    
    const report_channel = await d.getChannel('report')
    if(!report_channel){
      return
    }

    const boardChannel = this.client.util.resolveChannel(report_channel, guild.channels.cache); 
    if(!boardChannel){
        return 
    }
    const boss = await dm.getAllBoss()
	const knife = await dm.getAllProcessingKnife()
	let all_boss = []
	await boss.forEach(doc => {

		let data = doc.data()

		all_boss[doc.id] = {
			boss: doc.id,
			current_boss_hp: data.current_boss_hp,
			current_week: data.total_boss_died + 1,
			boss_max_hp: data.boss_max_hp[dm.checkPhase(data.total_boss_died + 1)],
			knife: []
		}
	})


	let all_knife = []
	await knife.forEach(doc => {
		let data = doc.data()
		all_boss[data.boss].knife.push(data)
	})

	all_boss.forEach(doc => {
		let boss = doc.boss
		let hp = doc.current_boss_hp
		let max = doc.boss_max_hp
		let week = doc.current_week
		let knife = doc.knife
	
		tableText += '`' + boss + '王  第' + week + '周  (' + hp + ' / ' + max + ') \t預約者：`\n'
		knife.forEach(doc => {
			if(doc.status == 'attacking'){
                tableText += '\t⚔'
            }else{
                tableText += '\t⌛'
            }
			if(doc.comment){
                let final = '\t' + doc.member
                var i;
            	for (i = 20; i > doc.member.length; i--) {
                    final += ' ';
            	}
                tableText += final + doc.comment + '\n'
            }else{
                tableText += '\t' + doc.member + '\n'
            }
		})
	})

	tableText += '\n最後更新：' + UtilLib.getFormattedDate();

    const board_message = await cm.getReportMessage()
    if (!board_message) {
        const boardMessage = await boardChannel.send(tableText);
        await cm.setReportMessage(boardMessage.id)
        return;
      } else {
         try {
            const boardMessage = await boardChannel.messages.fetch(board_message)
            boardMessage.edit(tableText);
         } catch (e) {
            console.log(e)
            const boardMessage = await boardChannel.send(tableText)
            await cm.setReportMessage(boardMessage.id)

         }
      };
    return
  }
}

module.exports = ReportUpdateListener;
