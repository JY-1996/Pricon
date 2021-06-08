const { Command } = require("discord-akairo");
const strings = require("../../lib/string.json");
const command = require("../../lib/command-info.json");
const UtilLib = require("../../api/util-lib");
const db = require('../../classes/Database');

class SetTimeCommand extends Command {
   constructor() {
      super('settime', {
         aliases: ['st','settime'],
         cooldown: 3000,
         channel: 'guild',
         args: [
            {
              id: "name",
              type: "string",
            },
            {
              id: "phase",
              type: "integer",
              default: 1
            },
            {
              id: "boss",
              type: "integer",
              default: 1
            },
            {
              id: "timetable",
              type: "string",
              prompt: {
                start: [
                  '請輸入刀表',
                ],
              }
            }
         ],
      });
   };

  //  async userPermissions(member) {
  //     return SettingsManager.checkMember(member);
  //  }

  async exec(message, args) {
    const guildID = message.guild.id
    const inp = args.timetable
    let line = inp.split("\n")
    let timelines = {}
    for (let i = 0; i < line.length; i++){
      let space_idx = line[i].indexOf(' ')
      if (space_idx > 0) {
        let time = line[i].substring(0, space_idx)
        let comment = line[i].substring(space_idx + 1)
        let timeline = {'time':time,'comment':comment}
        timelines[i] = timeline
      }
    }
    let out = JSON.stringify(timelines)
    let tableRef = db.collection('servers').doc(guildID).collection('timetable')
    await tableRef.add({
        name: args.name,
        phase: args.phase,
        boss: args.boss,
        data: out,
        time: Date.now(),
    })
    message.channel.send("已記錄"+args.name)
    return
  };

}
module.exports = SetTimeCommand;

