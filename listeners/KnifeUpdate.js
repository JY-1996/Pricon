const { Listener } = require('discord-akairo')
const UtilLib = require("../api/util-lib")
const CurrentBossDetail = require("../classes/CurrentBossDetail");

class KnifeUpdateListener extends Listener { 
  constructor() {
      super('knifeupdate', {
         emitter: 'client',
         event: 'knifeUpdate'
      });
   }

   async exec(guild) {
    const db = this.client.db
    
    let tableText = ''
    
    const serverQueryRef = db.collection("server").doc('setting');
    const serverQuery = await serverQueryRef.get()

    if(!serverQuery.data()){
      return
    }
    const serverSettings = serverQuery.data()
    const boardChannel = this.client.util.resolveChannel(serverSettings.board_channel, guild.channels.cache); 

    const curr_boss_detail = new CurrentBossDetail(db);
    const boss_detail = await curr_boss_detail.getDetail()
    const current_boss = boss_detail.current_boss
    const current_phase = boss_detail.current_phase
    const current_week = boss_detail.current_week
    const current_boss_hp = boss_detail.current_boss_hp

    tableText += '现在为第' + current_phase + '阶段第' + current_week + '周'+ current_boss + '王，剩余血量' + current_boss_hp + '萬\n\n--------------------------------------------------\n';

    const knifeQueryRef =  db.collection('knife').orderBy('time', 'asc')
    const knifeQuery = await knifeQueryRef.get()
    let array = [[],[],[],[],[]]

      knifeQuery.forEach(doc => {
          array[doc.data().boss - 1].push(doc.data())
      })
        
        array.forEach( (data,key) => {
          if(data.length){
            tableText += '`' + (key + 1) + '王 预约者：                               `\n'
            data.forEach(item => {
              if(item.status == 'attacking'){
                tableText += '\t' + item.member + '\t\t(进攻中。。。)\n'
              }else{
                tableText += '\t' + item.member + '\t\t' + item.comment + '\n'
              }
            })
          }else{
            tableText += '`' + (key + 1) + '王 无人预约                               `\n'
          }
        })
  
     if (!serverSettings.board_message) {
         const boardMessage = await boardChannel.send(tableText);
    
         await serverQueryRef.update({ board_message: boardMessage.id })
         return;

      } else {
         try {
            const boardMessage = await boardChannel.messages.fetch(serverSettings.board_message)
            boardMessage.edit(tableText);

         } catch (e) {
            const boardMessage = await boardChannel.send(tableText)
            await serverQueryRef.update({ board_message: boardMessage.id })

         }
      };
      return
   }

}

module.exports = KnifeUpdateListener;
