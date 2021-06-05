const { Command } = require("discord-akairo");
const strings = require("../../lib/string.json");
const command = require("../../lib/command-info.json");
const UtilLib = require("../../api/util-lib");
const db = require('../../classes/Database');

class ShiftCommand extends Command {
   constructor() {
      super("shift", {
         aliases: ['s','shift'],
         cooldown: 3000,
         channel: 'guild',
         args: [
            {
               id: "time",
               match: "number",
               default: 0
            }
         ],
      });
   };

  //  async userPermissions(member) {
  //     return SettingsManager.checkMember(member);
  //  }

   async exec(message, args) {
      const clientID = message.author.id

      let loadingMsg = await message.channel.send(strings.common.waiting);
     
      let serverCancelRef = await db.collection('knife').doc(clientID)
      let serverCancel = await serverCancelRef.get()

      if (!serverCancel.exists) {
        loadingMsg.edit(command.cancel.no_reserve.replace('[id]',clientID));
        return
      }
      await serverCancelRef.delete()
      loadingMsg.edit(command.cancel.cancel_reserve.replace('[id]',clientID));
      this.client.emit("knifeUpdate", message.guild);
      return
   };

}
module.exports = CancelCommand;

