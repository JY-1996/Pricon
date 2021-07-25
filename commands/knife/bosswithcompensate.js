const { Command } = require("discord-akairo");
const strings = require("../../lib/string.json");
const command = require("../../lib/command-info.json");
const DatabaseManager  = require("../../classes/DatabaseManager");
const UtilLib = require("../../api/util-lib");
const { Permissions } = require('discord.js');

class BossWithCompensateCommand extends Command {
   constructor() {
      super("bossCom", {
         aliases: ['bc','bossCom'],
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
                  start: strings.prompt.hp,
                  retry: strings.not_a_number,
               },
            },
            {
              id: "member",
              type: "memberMention",
            }
         ],
      });
   };

   async exec(message, args) {
      let loadingMsg = await message.channel.send(strings.common.waiting);

      //check channel
      const db = this.client.db
      const guildID = message.guild.id
      const dm = new DatabaseManager(db,guildID)

      const knife_channel = await dm.getChannel('knife')
      if(!knife_channel){
        loadingMsg.edit(strings.common.no_knife_channel);
        return
      }else if(knife_channel != message.channel.id){
        loadingMsg.edit(strings.common.wrong_knife_channel.replace('[channel]', `<#${knife_channel}>`));
        return
      }

      let clientID = message.member.id 
      if(args.member){
        if(message.member.hasPermission(Permissions.FLAGS.ADMINISTRATOR)){
          clientID = args.member.id
        }else{
          loadingMsg.edit(strings.common.no_permission);
          return
        }
      }

      const member = await message.guild.members.fetch(clientID)
      const clientName = UtilLib.extractInGameName(member.displayName, false)
      await dm.setClientID(clientID)

      const hp = args.hp;

      const boss_detail = await dm.getBossDetail()
      const current_boss = boss_detail.current_boss

      let serverKnife = await dm.getKnifeBossQuery(current_boss)
      if(!serverKnife.empty){
         await serverKnife.forEach(doc => {
            dm.updateKnifeToDoneWithCom(doc.id,current_boss)
        })
      }
      let boss_hp = boss_detail.current_boss_hp - hp
      if(boss_hp < 0){
        boss_hp = 0
      }
      await dm.updateBossHp(boss_hp)
      let text = command.boss.damage.replace('[id]',clientID).replace('[boss]', current_boss).replace('[hp]',hp)
      if(boss_hp == 0){
          text += command.boss.should_died.replace('[boss]', current_boss)
      }else{
          text += command.boss.hp_left.replace('[boss]', current_boss).replace('[hp]', boss_hp)
      }
      loadingMsg.edit(text)

      this.client.emit("reportUpdate", message.guild);
      this.client.emit("logUpdate", message.guild,command.boss.log.replace('[member]', clientName).replace('[boss]', current_boss).replace('[hp]', hp));
      this.client.emit("memberUpdate", message.guild);
      return;
   };

}
module.exports = BossWithCompensateCommand;

