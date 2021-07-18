const { Command } = require("discord-akairo");
const { Permissions } = require('discord.js');
const strings = require("../../lib/string.json");
const admin = require("../../lib/admin.json");
const AdminManager  = require("../../classes/AdminManager");
const { MessageEmbed } = require('discord.js');
const UtilLib = require("../../api/util-lib");

class AdminCancelCommand extends Command {
   constructor() {
      super('adminCancel', {
         aliases: ['ac','admincancel'],
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
             id: "member",
               type: "memberMention",
               prompt: {
                  start: strings.prompt.user,
                  retry: strings.prompt.not_a_member,
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
      const clientID = message.author.id
      const db = this.client.db
      const guildID = message.guild.id
 
      const dm = new AdminManager(db,guildID)

      let loadingMsg = await message.channel.send(strings.common.waiting);

      const member = args.member
      const boss = args.boss
      if (boss < 1 || boss > 5) {
         loadingMsg.edit(strings.common.boss_out_of_range);
         return
      }
      let knifeRef = await dm.cancelMemberKnife(member.id,boss)
      const memberName = UtilLib.extractInGameName(member.displayName, false)
      const embed = new MessageEmbed();
      embed.setColor("#90ffff");
      embed.setTitle(admin.cancel.reserve_cancel.replace('[member]', memberName));
      loadingMsg.delete()
      await message.channel.send(embed);
      this.client.emit("reportUpdate", message.guild);

      return
    }
    
 
}
module.exports = AdminCancelCommand;

