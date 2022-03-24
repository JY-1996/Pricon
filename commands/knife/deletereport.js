const strings = require("../../lib/string.json");
const command = require("../../lib/command-info.json");
const General = require("../../commands/knife/general.js");

class DeleteReportCommand extends General {
  constructor() {
    super("deletereport", {
      aliases: ['n','next'],
      cooldown: 3000,
      channel: 'guild',
      args: [
      ],
    });
  };

  async exec(message, args) {
    await super.exec(message,args)
    const report = await this.dm.deleteReport()
    this.loadingMsg.edit("留言刪除成功");
    return
  };

}
module.exports = DeleteReportCommand;
