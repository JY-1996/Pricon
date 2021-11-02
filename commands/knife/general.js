const { Command } = require("discord-akairo");
const strings = require("../../lib/string.json");
const command = require("../../lib/command-info.json");
const UtilLib = require("../../api/util-lib");
const Knife = require("../../classes/Knife");
const NewDatabaseManager = require("../../classes/NewDatabaseManager");
const { Permissions } = require('discord.js');

class General extends Command {
  async exec(message, args) { 

    this.loadingMsg = await message.channel.send(strings.common.waiting);

    this.db = this.client.db
    this.guildID = message.guild.id
    this.clientID = message.member.id 
    if(args.member){
      if(message.member.hasPermission(Permissions.FLAGS.ADMINISTRATOR)){
        this.clientID = args.member.id
      }else{
        this.loadingMsg.edit(strings.common.no_permission);
        return
      }
    } 

    const member = await message.guild.members.fetch(this.clientID)
    this.clientName = UtilLib.extractInGameName(member.displayName, false)
    
    this.dm = new NewDatabaseManager(this.db, this.guildID, this.clientID)

    this.boss = args.boss;
    if (this.boss < 1 || this.boss > 5) {
      this.loadingMsg.edit(strings.common.boss_out_of_range);
      return
    };

    await this.dm.insertMember(this.clientID, this.clientName)
  }

  async getKnifeCount(){
    

  }

}
module.exports = General;