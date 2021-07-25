const { Listener } = require('discord-akairo')
const AdminManager = require("../classes/AdminManager");
const DatabaseManager  = require("../classes/DatabaseManager");
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
    const dm = new DatabaseManager(db,guildID)
    const cm = new ChannelManager(db,guildID)

    const member_update_channel = await dm.getChannel('member_update')
    if(!member_update_channel){
      return
    }

    const role_id = await cm.getRoleId()
    if(!role_id){
      return
    }

    const boardChannel = this.client.util.resolveChannel(member_update_channel, guild.channels.cache); 
    if(!boardChannel){
      return 
    }

    let array = {}
    let text = ''

    let memberList = guild.roles.cache.find(role => 
      // role.id === '741160548577837157' //公會成員
      role.id === role_id
      ).members.map(member => 
      member.user
      )

      for (const member of memberList) {
        let memberData = await am.getMemberKnifeData(member.id)
        
        let count = 0
        await memberData.forEach(doc => {
          let status = doc.data().status
          let compensate = doc.data().compensate
          if(status == 'done'){
            if(compensate){
              count += 0.5
            }else{
              count += 1
            }
          }
        })

        const mMember = await guild.members.fetch(member.id)
        const clientName = UtilLib.extractInGameName(mMember.displayName, false)
        text += clientName + '出刀數：' + count + '\n'
      }

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
