class InfoManager {

   constructor(db) {
      this.db = db
   }

   async get(guildID, key = null) {
      let serverQueryRef = this.db
         .collection("servers")
         .doc(guildID);
      const doc = await serverQueryRef.get();

      if (!key) {
         return doc.data()
      }
      // console.log(doc.data());
      return doc.data()[key];
   };

   /**
    * Updates server info value
    * @param {*} guildID 
    * @param {*} key 
    * @param {*} newValue 
    */
   async update(guildID, key, newValue) {
      let serverQueryRef = this.db
         .collection("servers")
         .doc(guildID);
      let updatingObj = {};
      updatingObj[key] = newValue;
      await serverQueryRef.update(updatingObj);
   };
}

module.exports = InfoManager