const { Command } = require("discord-akairo");
const strings = require("../../lib/string.json");
const command = require("../../lib/command-info.json");
const UtilLib = require("../../api/util-lib");
const TimeTables = require("../../classes/TimeTables");
const prompter = require('discordjs-prompter');

class Timetable extends Command {
  constructor() {
    super('timetable', {
      aliases: ['t','timetable'],
      cooldown: 3000,
      channel: 'guild',
    });
  };

  *args() {
    const x = yield ({
        type: 'integer',
        prompt: {
            start:"1. 查看刀表\n2.新建刀表\n3.刪除刀表"
        }
    });
    if(x==2) {
      const name = yield ({
        type: 'string',
        prompt: {
          start:"請輸入刀表名稱"
        }
      })
      const phase = yield({
        type: "integer",
        prompt: {
          start:"几周?"
        }
      })
      const boss = yield({
        type: "integer",
        prompt: {
          start:"几王?"
        }
      })
      const timetable = yield({
        type: "string",
        prompt: {
          start: '請輸入刀表',
        }
      })
      return {x,name,phase,boss,timetable}
    }else{
      return {x}
    };
  }

  async exec(message, args) {
    const db = this.client.db
    let timetables = new TimeTables(db)
    await timetables.getTimeTables(message.guild.id)
    if (args.x == 1){ //查看
      let timetable = await timetables.listTimeTables(message.guild.id)
      message.channel.send(timetable)
      prompter.message(message.channel, {
        question: timetables,
        userId: message.author.id,
        max: 1,
        timeout: 10000,
      })
      .then(responses => {
        if (!responses.size) {
          // return message.channel.send(`No time for questions? I see.`);
          return
        }
        const response = responses.first();
      });
      return;
      //========================================================
    }else if(args.x == 2) { //新增
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
      return;
      //============================================================
    }else if (args.x == 3) { //刪除
      message.reply("刪除")
      return;
    }
    return;
  };

}
module.exports = Timetable;

