const { Listener } = require('discord-akairo')
const DatabaseManager = require("../classes/DatabaseManager");

class LogUpdateListener extends Listener { 
  constructor() {
      super('logupdate', {
         emitter: 'client',
         event: 'logUpdate'
      });
   }

  async exec(guild,message) {
    const db = this.client.db
    const guildID = guild.id

    const dm = new DatabaseManager(db,guildID)
    const log_channel = await dm.getChannel('log')
      if(!log_channel){
         return
      }
    const boardChannel = this.client.util.resolveChannel(log_channel, guild.channels.cache); 
    const boardMessage = await boardChannel.send(message);
    return;
  }
}

module.exports = LogUpdateListener;
