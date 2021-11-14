const { Listener } = require('discord-akairo')
const AdminManager = require("../classes/AdminManager");
const ChannelManager  = require("../classes/ChannelManager");
const UtilLib = require("../api/util-lib");

class MemberUpdateListener extends Listener { 
  constructor() {
    super('memberupdate', {
     emitter: 'client',
     event: 'memberUpdate'
   });
  }

  async exec(guild) {
    const db = this.client.db
    const guildID = guild.id
    const am = new AdminManager(db,guildID)
    const cm = new ChannelManager(db,guildID)

    const member_update_channel = await cm.getChannel('member_update')
    if(!member_update_channel){
      return
    }

    const boardChannel = this.client.util.resolveChannel(member_update_channel, guild.channels.cache); 
    if(!boardChannel){
      return 
    }

    let array = {}
    let text = ''

    let total = 0
    let memberCount = 0
    let memberData = await am.getMemberData()
        
    await memberData.forEach(doc => {
        let data = doc.data()
        if(data.SL){
          text += data.name + '出刀數：' + data.count + '(已SL)\n'
        }else{
          text += data.name + '出刀數：' + data.count + '\n'
        }
        total += data.count
        memberCount += 1
    })
    text = "出刀人数 = " + memberCount + "\n已出刀 = " + total + "\n\n" + text
    text += '\n最後更新：' + UtilLib.getFormattedDate();

    const board_message = await cm.getMemberUpdateMessage()
    if (!board_message) {
        const boardMessage = await boardChannel.send(text);
        await cm.setMemberUpdateMessage(boardMessage.id)
        return;
    } else {
       	try {
        	const boardMessage = await boardChannel.messages.fetch(board_message)
        	boardMessage.edit(text);
    	} catch (e) {
        	console.log(e)
        	const boardMessage = await boardChannel.send(text)
        	await cm.setMemberUpdateMessage(boardMessage.id)
    	}
    };
    return
  }
}

module.exports = MemberUpdateListener;
