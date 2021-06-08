const { Listener } = require('discord-akairo')
const UtilLib = require("../api/util-lib")
const CurrentBossDetail = require("../classes/CurrentBossDetail");

class ReportUpdateListener extends Listener { 
  constructor() {
      super('reportupdate', {
         emitter: 'client',
         event: 'reportUpdate'
      });
   }

   async exec(guild) {
    const db = this.client.db
    
    let tableText = ''
    
    const serverQueryRef = db.collection('servers').doc(guild.id).collection("setting").doc('report_channel');
    const serverQuery = await serverQueryRef.get()

    if(!serverQuery.exists){
      return
    }
    const serverSettings = serverQuery.data()

    const boardChannel = this.client.util.resolveChannel(serverSettings.id, guild.channels.cache); 
    if(!boardChannel){
        await serverQueryRef.delete()
        return 
    }
    const curr_boss_detail = new CurrentBossDetail(db);
    const boss_detail = await curr_boss_detail.getDetail(guild.id)
    const current_boss = boss_detail.current_boss
    const current_phase = boss_detail.current_phase
    const current_week = boss_detail.current_week
    const current_boss_hp = boss_detail.current_boss_hp

    tableText += '現在為第' + current_phase + '階段' + current_week + '周'+ current_boss + '王，剩餘血量' + current_boss_hp + '萬\n--------------------------------------------------\n';

    const knifeQueryRef =  db.collection('servers').doc(guild.id).collection('knife').orderBy('time', 'asc')
    const knifeQuery = await knifeQueryRef.get()
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
    // const boardMessage = await boardChannel.send(tableText);
    // await serverQueryRef.update({ id: boardMessage.id })

    if (!serverSettings.id) {
         // board message is not defined, send board message to the channel and save the id to database
         const boardMessage = await boardChannel.send(tableText);
         await serverQueryRef.update({ message: boardMessage.id })
         return;

      } else {
         // check if board_message message exist
         try {

            // try to fetch the board message
            const boardMessage = await boardChannel.messages.fetch(serverSettings.message)
            boardMessage.edit(tableText);

         } catch (e) {
            // actually catching the discord unknown message error due to the message being removed or in different channel
            console.log(e)
            const boardMessage = await boardChannel.send(tableText)
            await serverQueryRef.update({ message: boardMessage.id })

         }
      };
    return
  }

}

module.exports = ReportUpdateListener;
