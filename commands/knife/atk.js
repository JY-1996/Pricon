const { Command } = require("discord-akairo");
const strings = require("../../lib/string.json");
const command = require("../../lib/command-info.json");
const CurrentBossDetail = require("../../classes/CurrentBossDetail");

class AtkCommand extends Command {
  constructor() {
    super("atk", {
      aliases: ['atk'],
      cooldown: 3000,
      channel: 'guild',
      args: [{
        id: "compensate",
        match: "flag",
        flag: command.atk.flag
      }],
    });
  };

  //  async userPermissions(member) {
  //     return SettingsManager.checkMember(member);
  //  }

  async exec(message, args) {
    const clientID = message.author.id
    const db = this.client.db
    let loadingMsg = await message.channel.send(strings.common.waiting)
    
    const curr_boss_detail = new CurrentBossDetail(db);
    const boss_detail = await curr_boss_detail.getDetail()
    const current_boss = boss_detail.current_boss

    let knifeAtkRef = await db.collection('knife').doc(clientID)
    let knifeAtk = await knifeAtkRef.get()

    if (!knifeAtk.exists) {
      loadingMsg.edit(command.atk.no_reserve.replace('[id]',clientID))
      return
    }
    if (knifeAtk.data().boss != current_boss) {
      loadingMsg.edit(command.atk.diff_reserve.replace('[id]', clientID).replace('[boss]',knifeAtk.data().boss))
      return
    }
    let data = knifeAtk.data()
    if (data.status == 'attacking') {
      loadingMsg.edit(command.atk.attacking.replace('[id]',clientID))
      return
    }

    loadingMsg.edit(command.atk.attack.replace('[id]', clientID).replace('[boss]',knifeAtk.data().boss));
    await knifeAtkRef.update({
      status: 'attacking'
    })
    this.client.emit("knifeUpdate", message.guild);
    return
  }

}
module.exports = AtkCommand;