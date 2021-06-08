const Knife = require("../classes/Knife");
class DatabaseManager {

    constructor(db) {
      this.db = db
    }

    async getKnifeQuery(guildID){
      return  this.db.collection('servers')
                .doc(guildID)
                .collection('knife')
                .where('member_id','==', clientID)
                .where('status','in', ['processing', 'attacking'])
    }

    async getchannelQuery(guildID, channel){
      let queryRef =  this.db.collection('servers')
                        .doc(guildID)
                        .collection('setting')
                        .doc('channel')
      let query = await queryRef.get()
      if(!query.exists){
        return false
      }
      if(channel == 'knife'){
        return query.data().knife   
      }else if(channel == 'log'){
         return query.data().log
      }else if(channel == 'report'){
         return query.data().report
      }
      return false
    }

     async getKnifeCount(guildID){
      return  this.db.collection('servers')
                .doc(guildID)
                .collection('setting')
                .where('member_id','==', clientID)
                .where('status','in', ['processing', 'attacking'])
    }
}

module.exports = DatabaseManager