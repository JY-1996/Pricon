const strings = require("../../lib/string.json");
const command = require("../../lib/command-info.json");
const General = require("../../commands/knife/general.js");

class GetReportCommand extends General {
  constructor() {
    super("getreport", {
      aliases: ['s','status'],
      cooldown: 3000,
      channel: 'guild',
      args: [
      ],
    });
  };

  async exec(message, args) {
    await super.exec(message,args)
    let data = {
      name: this.clientName,
      comment: this.comment
    }
    const report = await this.dm.getReport()
    let text = ""
    await report.forEach(doc => {
  		let data = doc.data()
  	   text += "``" + data.clientName + " " + data.message + "``\n"
  	})
    if(text == ""){
      text = "沒有留言"
    }
    this.loadingMsg.edit(text);
    return
  };

}
module.exports = GetReportCommand;
