const { Command } = require("discord-akairo");
const strings = require("../../lib/string.json");
const command = require("../../lib/command-info.json");
const UtilLib = require("../../api/util-lib");
const TimeTables = require("../../classes/TimeTables");
const prompter = require('discordjs-prompter');

class ShiftCommand extends Command {
   constructor() {
      super("shift", {
         aliases: ['s','shift'],
         cooldown: 3000,
         channel: 'guild',
         args: [
            {
              id: "time",
              type: "integer",
              // match: "number",
              default: 0
            }
         ],
      });
   };

  async exec(message, args) {
    const guildID = message.guild.id
    const db = this.client.db
    let timetables = new TimeTables(db)
    await timetables.getTimeTables(message.guild.id)
    let inp = ''

    if(args.shift > 130 || args.shift < 0){
      message.channel.send("請輸入正確的時間")
    }
    await prompter.message(message.channel, {
        question: "請輸入刀表",
        userId: message.author.id,
        max: 1,
        timeout: 100000,
      }).then(responses => {
        if (!responses.size) {
          message.channel.send(`已超出時間。`);
          return
        }
        try{
          inp = responses.first()['content'];
        }catch(err){
          console.log(err)
          return
        }
    })
    try{
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
      // let out = JSON.stringify(timelines)
      
      let table = await timetables.getShifted(timelines,args.time)
      message.channel.send(table)
    }catch(err){
        console.log(err)
        return
    }
    return
  };

}
module.exports = ShiftCommand;

