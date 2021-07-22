const { Command } = require("discord-akairo");
const strings = require("../../lib/string.json");
const command = require("../../lib/command-info.json");
const DatabaseManager = require("../../classes/DatabaseManager");

class ListCommand extends Command {
   constructor() {
      super("list", {
         aliases: ['l','list'],
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

      let knifeQuery = await dm.getAllKnifeQuery()
      if (knifeQuery.empty) {
        loadingMsg.edit(command.list.no_reserve.replace('[id]',clientID));
        return
      }
      let text = command.list.title.replace('[id]',clientID)
      await knifeQuery.forEach(doc =>
          text += command.list.reserve.replace('[boss]', doc.data().boss).replace('[comment]', doc.data().comment)
      )
      loadingMsg.edit(text);
      return
   };

}
module.exports = ListCommand;

