const strings = require("../../lib/string.json");
const command = require("../../lib/command-info.json");
const General = require("../../commands/knife/general.js");

class SLCommand extends General {
  constructor() {
    super("sl", {
      aliases: ['sl'],
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
    var result = await super.exec(message,args)
      if(result == -1) { return }

    await this.dm.setSL(this.comment)

    this.loadingMsg.edit(command.sl.success);
    this.client.emit("memberUpdate", message.guild);
    return
  };

}
module.exports = SLCommand;
