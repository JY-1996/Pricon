const { Command } = require("discord-akairo");
const strings = require("../../lib/string.json");
const command = require("../../lib/command-info.json");
const DatabaseManager = require("../../classes/DatabaseManager");
const { Permissions } = require('discord.js');
const UtilLib = require("../../api/util-lib");

class SLCommand extends Command {
   constructor() {
      super("sl", {
         aliases: ['sl'],
         cooldown: 3000,
         channel: 'guild',
         args: [
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

      // const knife_channel = await dm.getChannel('knife')
      // if(!knife_channel){
      //   loadingMsg.edit(strings.common.no_knife_channel);
      //   return
      // }else if(knife_channel != message.channel.id){
      //   loadingMsg.edit(strings.common.wrong_knife_channel.replace('[channel]', `<#${knife_channel}>`));
      //   return
      // }

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

      await dm.setSL(clientID,clientName)
 
      loadingMsg.edit(command.sl.success);
      this.client.emit("memberUpdate", message.guild);
      return
   };

}
module.exports = SLCommand;

