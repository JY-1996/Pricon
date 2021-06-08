const { Command } = require("discord-akairo");
const strings = require("../../lib/string.json");
const command = require("../../lib/command-info.json");
const UtilLib = require("../../api/util-lib");
const CurrentBossDetail = require("../../classes/CurrentBossDetail");
const Global = require("../../classes/Global");

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
      const guildID = message.guild.id
      const clientID = message.author.id
      const clientName = message.author.username
      const db = this.client.db;

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

      const curr_boss_detail = new CurrentBossDetail(db);
      const boss_detail = await curr_boss_detail.getDetail(guildID)
      const current_boss = boss_detail.current_boss

      let serverKnifeRef = await db.collection('servers').doc(guildID).collection('knife').where('member_id','==',clientID).where('boss','==', current_boss).where('status','in', ['processing', 'attacking'])
      let serverKnife = await serverKnifeRef.get()

      if(serverKnife.empty){
        const member_detail = await message.guild.members.fetch(clientID)
        const member = UtilLib.extractInGameName(member_detail.displayName, false)
        await serverKnifeRef.set({
            boss: current_boss,
            comment: '',
            time: Date.now(),
            member:  member,
            member_id:  clientID,
            status: 'attacking'
            })
      }
      loadingMsg.edit(command.atk.attack.replace('[id]',clientID).replace('[boss]',current_boss))
      this.client.emit("reportUpdate", message.guild)
       this.client.emit("logUpdate", message.guild,command.atk.log.replace('[member]', clientName).replace('[boss]',current_boss))
      return
   };

}
module.exports = AtkCommand;

