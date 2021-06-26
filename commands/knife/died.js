const { Command } = require("discord-akairo");
const strings = require("../../lib/string.json");
const command = require("../../lib/command-info.json");
const DatabaseManager  = require("../../classes/DatabaseManager");

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

      const total_boss_died = boss_detail.total_boss_died    
      const current_boss = boss_detail.current_boss
      const next_boss = current_boss + 1 == 6 ? 1 : current_boss + 1

      await dm.nextBoss()
      //remove knife
      let serverKnife = await dm.getKnifeBossQuery(current_boss)
      if (!serverKnife.empty) {
        await serverKnife.forEach(doc => {
          dm.deleteKnife(doc.id)
        })
      }

      let text = command.died.boss_fainted.replace('[boss]', current_boss).replace('[next_boss]', next_boss)
      //get next boss member
      let knifeBoss = await dm.getAllKnifeBossQuery(next_boss)
      knifeBoss.forEach( doc => {
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

