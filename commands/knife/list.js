const { Command } = require("discord-akairo");
const strings = require("../../lib/string.json");
const command = require("../../lib/command-info.json");
const DatabaseManager = require("../../classes/DatabaseManager");
const { Permissions } = require('discord.js');
const UtilLib = require("../../api/util-lib");

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

      let knifeQuery = await dm.getAllKnifeQuery()
      if (knifeQuery.empty) {
        loadingMsg.edit(command.list.no_reserve.replace('[id]',clientID));
        return
      }
      let text = command.list.title.replace('[id]',clientID)
      await knifeQuery.forEach(doc => {
            if(doc.data().compensate){
               text += command.list.reserve.replace('[boss]', doc.data().boss).replace('[comment]', doc.data().comment) + "\t, (補償) \n"
            }else{
               text += command.list.reserve.replace('[boss]', doc.data().boss).replace('[comment]', doc.data().comment) + "\n"
            }
         }
      )
      loadingMsg.edit(text);
      return
   };

}
module.exports = ListCommand;

