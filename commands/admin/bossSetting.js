const { Command } = require("discord-akairo");
const strings = require("../../lib/string.json");
const command = require("../../lib/command-info.json");

class BossCommand extends Command {
   constructor() {
      super('bossSetting', {
         aliases: ['bS','bossSetting'],
         cooldown: 3000,
         channel: 'guild',
         args: [
            {
               id: 'compensate',
               match: 'flag',
               flag: ['c','-c','com','-com']
            }
         ],
      });
   };

  //  async userPermissions(member) {
  //     return SettingsManager.checkMember(member);
  //  }

   async exec(message, args) {
     const db = this.client.db
      let loadingMsg = await message.channel.send('等待中。。。');
     
      let boss_hp = {
        1:[600,800,1000,1200,1500],
        2:[600,800,1000,1200,1500],
        3:[700,900,1200,1500,2000],
        4:[1700,1800,2000,2100,2200],
        5:[8500,9000,9500,10000,10500]
      }

      let serverSettingRef = db.collection('server').doc('setting')
      let serverSetting = await serverSettingRef.get()

      await serverSettingRef.set({
        boss_max_hp:boss_hp,
        board_channel: '849929022930681866'  
      })

      let reportBossRef = db.collection('report').doc('boss')
      await reportBossRef.set({
        total_boss_died: 0,
        current_boss_hp: 600
      })
      loadingMsg.edit('完成')
      this.client.emit("knifeUpdate", message.guild);

      return
    }
    
 
}
module.exports = BossCommand;

