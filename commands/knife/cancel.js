const { Command } = require("discord-akairo");
const strings = require("../../lib/string.json");
const command = require("../../lib/command-info.json");
const DatabaseManager  = require("../../classes/DatabaseManager");


class CancelCommand extends Command {
   constructor() {
      super("cancel", {
         aliases: ['c','cancel'],
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
         ],
      });
   };

   async exec(message, args) {
      const guildID = message.guild.id
      const clientID = message.author.id
      const clientName = message.author.username
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

      const boss = args.boss
      if (boss < 1 || boss > 5) {
         loadingMsg.edit(strings.common.boss_out_of_range);
         return
      }

      let serverKnife = await dm.getKnifeBossQuery(boss)
      if (serverKnife.empty) {
        loadingMsg.edit(command.cancel.no_reserve.replace('[id]',clientID));
        return
      }
      await serverKnife.forEach(doc => {
          dm.deleteKnife(doc.id)
      })
      
      loadingMsg.edit(command.cancel.cancel_reserve.replace('[id]',clientID));
      this.client.emit("reportUpdate", message.guild);
      this.client.emit("logUpdate", message.guild,command.cancel.log.replace('[member]', clientName));
      return
   };

}
module.exports = CancelCommand;

