const { Command } = require("discord-akairo");
const strings = require("../../lib/string.json");
const command = require("../../lib/command-info.json");
const DatabaseManager  = require("../../classes/DatabaseManager");
const UtilLib = require("../../api/util-lib");

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

   async exec(message, args) {
      const guildID = message.guild.id
      const clientID = message.author.id
      const member = await message.guild.members.fetch(message.author.id)
      const clientName = UtilLib.extractInGameName(member.displayName, false)
      const db = this.client.db;
      const dm = new DatabaseManager(db,guildID,clientID)

      let loadingMsg = await message.channel.send(strings.common.waiting);
     
      const knife_channel = await dm.getChannel('knife')
      if(!knife_channel){
         loadingMsg.edit(strings.common.no_knife_channel);
         return
      }else if(knife_channel != message.channel.id){
         loadingMsg.edit(strings.common.wrong_knife_channel.replace('[channel]', `<#${knife_channel}>`));
         return
      }

      const boss_detail = await dm.getBossDetail()
      const current_boss = boss_detail.current_boss

      let serverKnife = await dm.getKnifeBossQuery(current_boss)
      if(serverKnife.empty){
        await dm.setKnife({
            boss: current_boss,
            comment: '',
            time: Date.now(),
            member:  clientName,
            member_id: clientID,
            status: 'attacking',
            isForced: true
        })
      }
      loadingMsg.edit(command.atk.attack.replace('[id]',clientID).replace('[boss]',current_boss))
      this.client.emit("reportUpdate", message.guild)
      this.client.emit("logUpdate", message.guild,command.atk.log.replace('[member]', clientName).replace('[boss]',current_boss))
      return
   };

}
module.exports = AtkCommand;

