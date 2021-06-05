const { Command } = require("discord-akairo");
const strings = require("../../lib/string.json");
const command = require("../../lib/command-info.json");
const UtilLib = require("../../api/util-lib");
const CurrentBossDetail = require("../../classes/CurrentBossDetail");

class AtkCommand extends Command {
   constructor() {
      super("atkx", {
         aliases: ['atkx'],
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

  //  async userPermissions(member) {
  //     return SettingsManager.checkMember(member);
  //  }

   async exec(message, args) {
      const clientID = message.author.id
      const db = this.client.db;
      let loadingMsg = await message.channel.send(strings.common.waiting);
     
      const curr_boss_detail = new CurrentBossDetail(db);
      const boss_detail = await curr_boss_detail.getDetail()
      const current_boss = boss_detail.current_boss

      let knifeAtkRef = await db.collection('knife').doc(clientID)
      let knifeAtk = await knifeAtkRef.get()

      if (knifeAtk.exists && knifeAtk.data().boss == current_boss) {
          let data = knifeAtk.data()
          if(data.status == 'attacking'){
              return loadingMsg.edit(command.atk.attacking.replace('[id]',clientID));
          }
          knifeAtkRef.update({status: 'attacking'})
      }else{
          const member_detail = await message.guild.members.fetch(clientID)
          const member = UtilLib.extractInGameName(member_detail.displayName, false)
          let knifeRef = await db.collection('knife').doc(clientID)
              .set({
                    boss: current_boss,
                    comment: '',
                    time: Date.now(),
                    member:  member,
                    status: 'attacking'
                  })
      }
      loadingMsg.edit(command.atk.attack.replace('[id]',clientID).replace('[boss]',current_boss));
      this.client.emit("knifeUpdate", message.guild);
      return
   };

}
module.exports = AtkCommand;

