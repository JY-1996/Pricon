const { Command } = require("discord-akairo");
const Prompter = require('discordjs-prompter');
const { Listener } = require('discord-akairo')
const AdminManager = require("../../classes/AdminManager");
const DatabaseManager  = require("../../classes/DatabaseManager");
const ChannelManager  = require("../../classes/ChannelManager");
const UtilLib = require("../../api/util-lib");

class PingCommand extends Command {
   constructor() {
      super("ping", {
         aliases: ["ping", "🏓"],
      });
   };

   async exec(message) {
	    this.client.emit("reportUpdate", message.guild);
    // await message.channel.send("12345");
    // this.client.emit("dailyReset");
   // const db = this.client.db
   //  const guildID = message.guild.id
   //  const am = new AdminManager(db,guildID)
   //  const dm = new DatabaseManager(db,guildID)
   //  const cm = new ChannelManager(db,guildID)

   //  const member_update_channel = await dm.getChannel('member_update')
   //  if(!member_update_channel){
   //    return
   //  }

   //  const role_id = await cm.getRoleId()
   //  if(!role_id){
   //    return
   //  }

   //  const boardChannel = this.client.util.resolveChannel(member_update_channel, message.guild.channels.cache); 
   //  if(!boardChannel){
   //    return 
   //  }

   //  let array = {}
   //  let text = ''

   //    await message.guild.members.fetch();
   //  let memberList = message.guild.roles.cache.find(role => 
   //    // role.id === '741160548577837157' //公會成員
   //    role.id === role_id
   //    ).members.map(member => 
   //    member.user
   //    )
   //    let total = 0
   //    for (const member of memberList) {
   //      let memberData = await am.getMemberKnifeData(member.id)
        
   //      let count = 0
   //      await memberData.forEach(doc => {
   //        let status = doc.data().status
   //        let compensate = doc.data().compensate
   //        if(status == 'done'){
   //          if(compensate){
   //            count += 0.5
   //          }else{
   //            count += 1
   //          }
   //        }
   //      })
   //      total += count
   //      const mMember = await message.guild.members.fetch(member.id)
   //      const clientName = UtilLib.extractInGameName(mMember.displayName, false)
   //      text += clientName + '出刀數：' + count + '\n'
   //    }
   //    text = "已出刀 = " + total + "\n\n" + text
   //    text += '\n最後更新：' + UtilLib.getFormattedDate();
   //    await message.channel.send(text);
   }
}
module.exports = PingCommand;