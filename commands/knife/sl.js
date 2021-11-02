const strings = require("../../lib/string.json");
const command = require("../../lib/command-info.json");
const General = require("../../commands/knife/general.js");

class SLCommand extends General {
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
      await super.exec(message,args)

      await this.dm.setSL()
 
      this.loadingMsg.edit(command.sl.success);
      this.client.emit("memberUpdate", message.guild);
      return
   };

}
module.exports = SLCommand;

