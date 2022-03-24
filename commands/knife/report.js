const strings = require("../../lib/string.json");
const command = require("../../lib/command-info.json");
const General = require("../../commands/knife/general.js");

class ReportCommand extends General {
  constructor() {
    super("report", {
      aliases: ['i'],
      cooldown: 3000,
      channel: 'guild',
      args: [
        {
          id: "comment",
          type: "string",
          match: "restContent"
        }
      ],
    });
  };

  async exec(message, args) {
    await super.exec(message,args)
    let comment = this.comment
    if(comment == ""){
      comment += "我进去了"
    }
    await this.dm.createNewReport(this.clientName, comment, Date.now())

    this.loadingMsg.edit("留言記錄成功");
    return
  };

}
module.exports = ReportCommand;
