const { Listener } = require('discord-akairo')
const UtilLib = require("../api/util-lib")
const DatabaseManager = require("../classes/DatabaseManager");

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
    const dm = new DatabaseManager(db,guildID)
    
    let tableText = ''
    
    const report_channel = await dm.getChannel('report')
    if(!report_channel){
      return
    }

    const boardChannel = this.client.util.resolveChannel(report_channel, guild.channels.cache); 
    if(!boardChannel){
        return 
    }
    const boss_detail = await dm.getBossDetail()
    const current_boss = boss_detail.current_boss
    const current_phase = boss_detail.current_phase
    const current_week = boss_detail.current_week
    const current_boss_hp = boss_detail.current_boss_hp

    tableText += '現在為第' + current_phase + '階段' + current_week + '周'+ current_boss + '王，剩餘血量' + current_boss_hp + '萬\n--------------------------------------------------\n';

    const knifeQuery = await dm.getAllKnife()
    let array = [[],[],[],[],[]]

    knifeQuery.forEach(doc => {
      if(doc.data().status != 'done'){
        array[doc.data().boss - 1].push(doc.data())
      }
    })
    array.forEach( (data,key) => {
        if(data.length){
            tableText += '`' + (key + 1) + '王 預約者：                               `\n'
            data.forEach(item => {
              if(item.comment){
                tableText += '\t' + item.member + '\t\t' + item.comment + '\n'
              }else{
                tableText += '\t' + item.member + '\n'
              }
            })
        }else{
            tableText += '`' + (key + 1) + '王 無人預約                               `\n'
        }
    })
    const board_message = await dm.getReportMessage()
    if (!board_message) {
        const boardMessage = await boardChannel.send(tableText);
        await dm.setReportMessage(boardMessage.id)
        return;
      } else {
         try {
            const boardMessage = await boardChannel.messages.fetch(board_message)
            boardMessage.edit(tableText);
         } catch (e) {
            console.log(e)
            const boardMessage = await boardChannel.send(tableText)
            await dm.setReportMessage(boardMessage.id)

         }
      };
    return
  }

}

module.exports = ReportUpdateListener;
