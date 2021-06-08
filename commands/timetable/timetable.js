const { Command } = require("discord-akairo");
const strings = require("../../lib/string.json");
const command = require("../../lib/command-info.json");
const UtilLib = require("../../api/util-lib");
const TimeTables = require("../../classes/TimeTables");

class Timetable extends Command {
  constructor() {
    super('timetable', {
      aliases: ['t','timetable'],
      cooldown: 3000,
      channel: 'guild',
    });
  };

  *args() {
    const x = yield {
        type: 'integer',
        prompt: {
            start:"1. 查看刀表\n2.新建刀表\n3.刪除刀表"
        }
    };
    const y = yield (x == 1 ? {
      type: 'integer',
      prompt: {
        start:"請輸入刀表編號"
      }
    } : x == 3 ? {
      type: 'integer',
      prompt: {
        start:"請輸入刀表編號"
      }
    } : {type:'integer',default:0} );

    // When finished.
    return { x, y };
}

  async exec(message, args) {
    if (args.x == 1){
      message.reply("查看")
      return;
    }else if (args.x == 2) {
      message.reply("新增")
      return;
    }else if (args.x == 3) {
      message.reply("刪除")
      return;
    }
    return;
  };

}
module.exports = Timetable;

