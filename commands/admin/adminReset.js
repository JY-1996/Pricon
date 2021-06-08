const { Command } = require("discord-akairo");
const { Permissions } = require('discord.js');
const strings = require("../../lib/string.json");
const CurrentBossDetail = require("../../classes/CurrentBossDetail");
const admin = require("../../lib/admin.json");
const { MessageEmbed } = require('discord.js');

class AdminResetCommand extends Command {
   constructor() {
      super('adminReset', {
         aliases: ['reset'],
         cooldown: 3000,
         channel: 'guild',
         userPermissions: Permissions.FLAGS.ADMINISTRATOR,
         args: [
            {
               id: 'compensate',
               match: 'flag',
               flag: ['c','-c','com','-com']
            },
            {
               id: "week",
               type: "integer",
               prompt: {
                  start: strings.prompt.week,
                  retry: strings.prompt.not_a_number,
               },
            },
            {
               id: "boss",
               type: "integer",
               prompt: {
                  start: strings.prompt.boss,
                  retry: strings.prompt.not_a_number,
               },
            },
         ],
      });
   };

   async exec(message, args) {
      const guildID = message.guild.id
      const clientID = message.author.id
      const db = this.client.db
      
      let loadingMsg = await message.channel.send(strings.common.waiting);

      const week = args.week
      const boss = args.boss

      const total_boss_died = (week - 1) * 5 + boss -1  
      const curr_boss_detail = new CurrentBossDetail(db);
      const detail = await curr_boss_detail.resetBoss(guildID,total_boss_died)
      
      const embed = new MessageEmbed();
      embed.setColor("#90ffff");
      embed.setTitle(admin.reset.title + ' | ' +admin.reset.field.replace('[phase]', detail.phase).replace('[week]', detail.week).replace('[boss]', detail.boss));
      loadingMsg.delete()
      await message.channel.send(embed);
      this.client.emit("reportUpdate", message.guild);

      return
    }
    
 
}
module.exports = AdminResetCommand;

