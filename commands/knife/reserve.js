const { Command } = require("discord-akairo");
const strings = require("../../lib/string.json");
const command = require("../../lib/command-info.json");
const UtilLib = require("../../api/util-lib");
const Knife = require("../../classes/Knife");
const DatabaseManager = require("../../classes/DatabaseManager");

class ReserveCommand extends Command {
   constructor() {
      super("reserve", {
         aliases: ['r','reserve','預約'],
         cooldown: 3000,
         channel: 'guild',
         args: [
            {
               id: "compensate",
               match: "flag",
               flag: ['c','-c','com','-com']
            },
            {
               id: "boss",
               type: "integer",
               prompt: {
                  start: strings.prompt.boss,
                  retry: strings.prompt.not_a_number,
               },
            },
            {
               id: "comment",
               type: "string",
               match: "restContent"
            }
         ],
      });
   };

   async exec(message, args) {   
      const db = this.client.db
      const guildID = message.guild.id
      const clientID = message.author.id 
      const member = await message.guild.members.fetch(message.author.id)
      const clientName = UtilLib.extractInGameName(member.displayName, false)
      const dm = new DatabaseManager(db,guildID,clientID)
      
      let loadingMsg = await message.channel.send(strings.common.waiting);
      
      const boss = args.boss;
      if (boss < 1 || boss > 5) {
         loadingMsg.edit(strings.common.boss_out_of_range);
         return
      };

      let comment = ''
      if (args.comment) {
        comment = args.comment;
      }
      
      const knife_channel = await dm.getChannel('knife')
      if(!knife_channel){
         loadingMsg.edit(strings.common.no_knife_channel);
         return
      }else if(knife_channel != message.channel.id){
         loadingMsg.edit(strings.common.wrong_knife_channel.replace('[channel]', `<#${knife_channel}>`));
         return
      }

      let serverKnife = await dm.getKnifeQuery()

      let boss_detail =  await dm.getBossDetail()
      let knifeCount = boss_detail.knife_count
      if(knifeCount){
        if(serverKnife.size >= knifeCount){
            loadingMsg.edit(command.reserve.knife_count_exceed.replace('[id]', clientID).replace('[count]', knifeCount).replace('[current]', serverKnife.size))
            return
        }
      }
  
      let serverCurrentBoss = await dm.getKnifeBossQuery(boss)
      if(!serverCurrentBoss.empty){
          loadingMsg.edit(command.reserve.repeated.replace('[id]', clientID))
            return
      }
      
      await dm.setKnife({
          boss: boss,
          comment: comment,
          time: Date.now(),
          member:  clientName,
          member_id: clientID,
          status: 'processing'
      })

      loadingMsg.edit(command.reserve.reserved.replace('[id]', clientID).replace('[boss]',boss).replace('[comment]',comment));
      
      this.client.emit("reportUpdate", message.guild);
      this.client.emit("logUpdate", message.guild,command.reserve.log.replace('[member]', clientName).replace('[boss]',boss).replace('[comment]',comment));
      return;
   };

}
module.exports = ReserveCommand;

