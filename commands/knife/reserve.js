const { Command } = require("discord-akairo");
const strings = require("../../lib/string.json");
const command = require("../../lib/command-info.json");
const UtilLib = require("../../api/util-lib");
const { MessageEmbed } = require('discord.js');

class ReserveCommand extends Command {
   constructor() {
      super("reserve", {
         aliases: ['r','reserve'],
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
      const clientID = message.author.id
      const db = this.client.db

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
      const member_detail = await message.guild.members.fetch(clientID)
      const member = UtilLib.extractInGameName(member_detail.displayName, false)
      
      let knifeRef = db.collection('knife').doc(clientID)
      let knife = await knifeRef.get();
      if (knife.exists) {
        loadingMsg.edit(command.reserve.repeated.replace('[id]', clientID).replace('[boss]',knife.data().boss))
        return
      } 

      await knifeRef.set({
          boss: boss,
          comment: comment,
          time: Date.now(),
          member:  member,
          member_id: message.author.id,
          status: 'processing'
      })

      loadingMsg.edit(command.reserve.reserved.replace('[id]', clientID).replace('[boss]',boss));
      
      // const embed = new MessageEmbed();
      // embed.setColor("#90ffff");
      // embed.addField("自己",'改', true);
      // loadingMsg.delete();
      // return message.channel.send(embed)
      this.client.emit("knifeUpdate", message.guild);
      return;

    
   };

}
module.exports = ReserveCommand;

