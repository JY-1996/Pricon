const { Command } = require("discord-akairo");
const help = require("../../lib/help.json");
const { MessageEmbed } = require('discord.js');

class HelpCommand extends Command {
   constructor() {
      super("adminHelp", {
         aliases: ['ah','adminhelp'],
         channel: 'guild',
         args: [
            {
               id: "compensate",
               match: "flag",
               flag: ['c','-c','com','-com']
            },
            {
               id: "comment",
               type: "string",
               match: "restContent"
            }
         ],
      });
   };

   async exec(message,args) {

      let loadingMsg = await message.channel.send('等候中...');
      
      const embed = new MessageEmbed();
      embed.setColor("#90ffff");
      
      if(!args.comment){
          embed.setTitle(help.generalHelp.list_title);

          Object.keys(help.admin).forEach(key => {
            embed.addField(help.admin[key].name, help.admin[key].shortDescription, true);
         });
         embed.setFooter(help.generalHelp.list_admin_footer);
      }else{
         const command = this.getCommand(help.admin,args.comment)
        if(command == false){
          loadingMsg.edit(help.generalHelp.invalid_command_name);
          return
        }

        embed.setTitle(`${command.name}: ${command.shortDescription}`);
        embed.addField(help.generalHelp.display, `\`${command.displayAlias}\``, true);
        embed.addField(help.generalHelp.syntax, `\`${command.syntax}\``, true);
        embed.addField(help.generalHelp.description, command.description, false);
      }
      loadingMsg.delete();
      message.channel.send(embed)
      return
   }
   getCommand(command, commandName) {
      let isMatched = false;
      let returnObj;
      Object.keys(command).forEach(key => {
         if (command[key].alias.includes(commandName) && isMatched == false) {
            returnObj = command[key];
            isMatched = true;
         };
      });
      if (returnObj) {
         return returnObj;
      } else return false;

   };
}
module.exports = HelpCommand;