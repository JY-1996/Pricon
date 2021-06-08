const { Command } = require("discord-akairo");
const strings = require("../../lib/string.json");
const command = require("../../lib/command-info.json");
const UtilLib = require("../../api/util-lib");
const CurrentBossDetail = require("../../classes/CurrentBossDetail");
const Global = require("../../classes/Global");

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
      const guildID = message.guild.id
      const clientID = message.author.id
      const clientName = message.author.username
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

      const hp = args.hp;

      const curr_boss_detail = new CurrentBossDetail(db);
      const boss_detail = await curr_boss_detail.getDetail(guildID)
      const current_boss = boss_detail.current_boss

      let serverKnifeRef = db.collection('servers').doc(guildID).collection('knife')
        .where('member_id','==',clientID).where('boss','==',current_boss).where('status','in', ['processing', 'attacking'])
      let serverKnife = await serverKnifeRef.get()
      if(!serverKnife.empty){
         await serverKnife.forEach(doc => {
          db.collection('servers').doc(guildID).collection('knife').doc(doc.id)
          .update({ status:'done' })
        })
      }
      let boss_hp = boss_detail.current_boss_hp - hp
      if(boss_hp < 0){
        boss_hp = 0
      }
      await curr_boss_detail.updateBossHp(guildID,boss_hp)
      let text = command.boss.damage.replace('[id]',clientID).replace('[boss]', current_boss).replace('[hp]',hp)
      if(boss_hp == 0){
          text += command.boss.should_died.replace('[boss]', current_boss)
      }else{
          text += command.boss.hp_left.replace('[boss]', current_boss).replace('[hp]', boss_hp)
      }
      loadingMsg.edit(text)

      this.client.emit("reportUpdate", message.guild);
      this.client.emit("logUpdate", message.guild,command.boss.log.replace('[member]', clientName).replace('[boss]', current_boss).replace('[hp]', hp));
      return;
   };

}
module.exports = BossCommand;

