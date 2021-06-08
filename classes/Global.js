class Global {

   constructor(db) {
      this.db = db
   }
   async getKnifeChannel(guildID){
      const serverQueryRef = this.db
         .collection('servers')
         .doc(guildID)
         .collection('setting')
         .doc('knife_channel')
      const serverQuery = await serverQueryRef.get()
      if(!serverQuery.exists){
          return false
      }
      return serverQuery.data().id
   }
}

module.exports = Global;