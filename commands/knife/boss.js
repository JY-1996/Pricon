const { Command } = require("discord-akairo");
const strings = require("../../lib/string.json");
const command = require("../../lib/command-info.json");
const UtilLib = require("../../api/util-lib");
const CurrentBossDetail = require("../../classes/CurrentBossDetail");

class BossCommand extends Command {
   constructor() {
      super("boss", {
         aliases: ['b','boss'],
         cooldown: 3000,
         channel: 'guild',
         args: [
            {
               id: "compensate",
               match: "flag",
               flag: ['c','-c','com','-com']
            },
            {
               id: "hp",
               type: "integer",
               prompt: {
                  start: strings.prompt.boss,
                  retry: strings.not_a_number,
               },
            },
         ],
      });
   };

   async exec(message, args) {
      const clientID = message.author.id
      const db = this.client.db

      let loadingMsg = await message.channel.send(strings.common.waiting);
      
      const hp = args.hp;

      const curr_boss_detail = new CurrentBossDetail(db);
      const boss_detail = await curr_boss_detail.getDetail()
      const current_boss = boss_detail.current_boss

      let knifeQueryRef = db
         .collection('knife')
         .doc(clientID)
      let knifeQuery = await knifeQueryRef.get()
      if (!knifeQuery.exists || knifeQuery.data().boss != current_boss) {
          loadingMsg.edit(command.boss.no_reserve.replace('[id]',clientID))
          return
      }  
      await knifeQueryRef.delete()
      let boss_hp = boss_detail.current_boss_hp - hp
      if(boss_hp < 0){
        boss_hp = 0
      }
      await curr_boss_detail.updateBossHp(boss_hp)
      let text = command.boss.damage.replace('[id]',clientID).replace('[boss]', current_boss).replace('[hp]',hp)
      if(boss_hp == 0){
          text += command.boss.should_died.replace('[boss]', current_boss)
      }else{
          text += command.boss.hp_left.replace('[boss]', current_boss).replace('[hp]', boss_hp)
      }
      loadingMsg.edit(text)
      this.client.emit("knifeUpdate", message.guild);
      return;
   };

}
module.exports = BossCommand;

