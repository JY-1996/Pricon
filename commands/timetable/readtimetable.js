const { Command } = require("discord-akairo");
const strings = require("../../lib/string.json");
const command = require("../../lib/command-info.json");
const UtilLib = require("../../api/util-lib");
const TimeTables = require("../../classes/TimeTables");

class ReadTimeTableCommand extends Command {
   constructor() {
      super('readtimetable', {
         aliases: ['rtt','readtimetable'],
         cooldown: 3000,
         channel: 'guild',
         args: [
            {
              id: "no",
              type: "number",
              default: 0
            }
         ],
      });
   };

  async exec(message, args) {
    const db = this.client.db
    let timetables = new TimeTables(db)
    await timetables.getTimeTables(message.guild.id)
    let timetable = await timetables.listTimeTables(message.guild.id)
    message.channel.send(timetable)
    return
  };

}
module.exports = ReadTimeTableCommand;

