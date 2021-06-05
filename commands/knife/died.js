const { Command } = require("discord-akairo");
const strings = require("../../lib/string.json");
const command = require("../../lib/command-info.json");
const UtilLib = require("../../api/util-lib");
const CurrentBossDetail = require("../../classes/CurrentBossDetail");

class DiedCommand extends Command {
   constructor() {
      super("died", {
         aliases: ['d','died'],
         cooldown: 3000,
         channel: 'guild',
         args: [
            {
               id: "compensate",
               match: "flag",
               flag: ['c','-c','com','-com']
            }
         ],
      });
   };

   async exec(message, args) {
      const clientID = message.author.id
      const db = this.client.db

      let loadingMsg = await message.channel.send(strings.common.waiting);
      
      const boss = args.boss;
      let comment = ''
      if (args.comment) {
        comment = args.comment;
      }

      const member_detail = await message.guild.members.fetch(clientID)
      const member = UtilLib.extractInGameName(member_detail.displayName, false)

      const curr_boss_detail = new CurrentBossDetail(db);
      const boss_detail = await curr_boss_detail.getDetail()

      const total_boss_died = boss_detail.total_boss_died    
      const current_boss = boss_detail.current_boss
      const next_boss = current_boss + 1 == 6 ? 1 : current_boss + 1

      await curr_boss_detail.nextBoss()
      //remove knife
      let knifeQueryRef = db.collection('knife').doc(clientID)
      let knifeQuery = await knifeQueryRef.get();
      if (knifeQuery.exists) {
        if(knifeQuery.data().boss == current_boss){
            await knifeQueryRef.delete()
          }
      }

      let text = command.died.boss_fainted.replace('[boss]', current_boss).replace('[next_boss]', next_boss)
      //get next boss member
      let knifeBossQuery = await db.collection('knife').where('boss','==',next_boss).get()
      knifeBossQuery.forEach( doc => {
        const data = doc.data()
        text += command.died.member_info.replace('[id]',data.member_id).replace('[comment]', data.comment)
      })
      loadingMsg.edit(text);

      this.client.emit("knifeUpdate", message.guild);
      return;
   };

}
module.exports = DiedCommand;

