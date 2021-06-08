const { Listener } = require('discord-akairo')
const UtilLib = require("../api/util-lib")
const CurrentBossDetail = require("../classes/CurrentBossDetail");

class LogUpdateListener extends Listener { 
  constructor() {
      super('logupdate', {
         emitter: 'client',
         event: 'logUpdate'
      });
   }

  async exec(guild,message) {
    const db = this.client.db
    const serverQueryRef = db.collection('servers').doc(guild.id).collection("setting").doc('log_channel');
    const serverQuery = await serverQueryRef.get()

    if(!serverQuery.data()){
      return
    }
    const serverSettings = serverQuery.data()
    const boardChannel = this.client.util.resolveChannel(serverSettings.id, guild.channels.cache); 
    const boardMessage = await boardChannel.send(message);
    return;
  }
}

module.exports = LogUpdateListener;
