const { Command } = require("discord-akairo");
const { Permissions } = require('discord.js');
const strings = require("../../lib/string.json");
const admin = require("../../lib/admin.json");

class AdminBossCommand extends Command {
   constructor() {
      super('adminBoss', {
         aliases: ['ab','adminboss'],
         cooldown: 3000,
         channel: 'guild',
         userPermissions: Permissions.FLAGS.ADMINISTRATOR,
         args: [
            {
               id: 'compensate',
               match: 'flag',
               flag: ['c','-c','com','-com']
            }
         ],
      });
   };

   async exec(message, args) {
      const db = this.client.db
      const guildID = message.guild.id;
      let loadingMsg = await message.channel.send(strings.common.waiting);

      const serverQueryRef = db
         .collection('servers')
         .doc(guildID)
         .collection('setting')
         .doc('boss_max_hp')
      let serverQuery = serverQueryRef.get() 
      if(!serverQuery.exist){
          await serverQueryRef.set({
              1:[600,800,1000,1200,1500],
              2:[600,800,1000,1200,1500],
              3:[700,900,1200,1500,2000],
              4:[1700,1800,2000,2100,2200],
              5:[8500,9000,9500,10000,10500]
          })
      }
      const serverBossQueryRef = db
         .collection('servers')
         .doc(guildID)
         .collection('setting')
         .doc('boss')
      let serverBossQuery = serverBossQueryRef.get() 
      if(!serverBossQuery.exist){
          await serverBossQueryRef.set({
              total_boss_died: 0,
              current_boss_hp: 600
          })
      }
      // await serverSettingRef.set({
        // boss_max_hp:boss_hp,
      //   board_channel: '849929022930681866'  
      // })

      // let reportBossRef = db.collection('report').doc('boss')
      // await reportBossRef.set({
      //   total_boss_died: 0,
      //   current_boss_hp: 600
      // })
      loadingMsg.edit('完成')
      this.client.emit("knifeUpdate", message.guild);

      return
    }
    
 
}
module.exports = AdminBossCommand;

