const { Command } = require("discord-akairo");
const strings = require("../../lib/string.json");
const command = require("../../lib/command-info.json");
const UtilLib = require("../../api/util-lib");
const CurrentBossDetail = require("../../classes/CurrentBossDetail");
const Global = require("../../classes/Global");

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
      const guildID = message.guild.id
      const clientID = message.author.id
      const db = this.client.db

      let loadingMsg = await message.channel.send(strings.common.waiting);
      
      const global = new Global(db);
      const knife_channel = await global.getKnifeChannel(guildID)
      if(!knife_channel){
         loadingMsg.edit(strings.common.no_knife_channel);
         return
      }else if(knife_channel != message.channel.id){
         loadingMsg.edit(strings.common.wrong_knife_channel.replace('[channel]', `<#${knife_channel}>`));
         return
      }

      const member_detail = await message.guild.members.fetch(clientID)
      const member = UtilLib.extractInGameName(member_detail.displayName, false)

      const curr_boss_detail = new CurrentBossDetail(db);
      const boss_detail = await curr_boss_detail.getDetail(guildID)

      const total_boss_died = boss_detail.total_boss_died    
      const current_boss = boss_detail.current_boss
      const next_boss = current_boss + 1 == 6 ? 1 : current_boss + 1

      await curr_boss_detail.nextBoss(guildID)
      //remove knife
      let serverKnifeRef = db.collection('servers').doc(guildID).collection('knife').where('member_id','==',clientID).where('boss','==', current_boss).where('status','in', ['processing', 'attacking'])
      let serverKnife = await serverKnifeRef.get();
      if (!serverKnife.empty) {
        await serverKnife.forEach(doc => {
          db.collection('servers').doc(guildID).collection('knife').doc(doc.id).update({status:'done'})
        })
      }

      let text = command.died.boss_fainted.replace('[boss]', current_boss).replace('[next_boss]', next_boss)
      //get next boss member
      let knifeBossQuery = await db.collection('servers').doc(guildID).collection('knife').where('boss','==',next_boss).get()
      knifeBossQuery.forEach( doc => {
        const data = doc.data()
        text += command.died.member_info.replace('[id]',data.member_id).replace('[comment]', data.comment)
      })
      loadingMsg.edit(text);

      this.client.emit("reportUpdate", message.guild);
      this.client.emit("logUpdate", message.guild,command.died.log.replace('[boss]', current_boss).replace('[next_boss]', next_boss));
      return;
   };

}
module.exports = DiedCommand;

