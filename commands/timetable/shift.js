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
              id: "phase",
              match: "number",
              default: 1
            },
            {
              id: "boss",
              match: "number",
              default: 1
            },
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
    const guildID = message.guild.id
    const db = this.client.db
    let loadingMsg = await message.channel.send(strings.common.waiting)
    let docname = String(args.phase) + '_' + String(args.boss)
    let timetable = this.db.collection('servers').doc(guildID).collection('timetable').doc(docname)
    time = timetable.time
    comment = timetable.comment
    console.log(time)
    console.log(comment)
    loadingMsg.edit("GG")
    return
  };

}
module.exports = ShiftCommand;

