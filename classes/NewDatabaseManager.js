class NewDatabaseManager {

  constructor(db,guildID,clientID = null) {
    this.db = db
    this.guildID = guildID
    this.clientID = clientID
  }

  async getKnifeCount(){
    let memberData = await this.db.collection('servers')
      .doc(this.guildID)
      .collection('member')
      .where('member_id','==', this.clientID)
      .get()
      if(memberData.exists){
        let data = memberData.data()
        return data.count
      }
      return 0
  }

  async checkKnifeRepeat(boss){
    let query = await this.db.collection('servers')
      .doc(this.guildID)
      .collection('knife')
      .where('boss','==', boss)
      .get()
    if(query.empty){
      return false
    }
    return true
  }

  async insertMember(member_id,member_name){
    let query = await this.db.collection('servers')
      .doc(this.guildID)
      .collection('member')
      .doc(member_id)

    let data = await query.get()
    if(!data.exists){
      await query.set({
          SL: false,
          name: member_name,
          count: 0
      })  
    }
  }

  async getAllKnifeQuery(){
    return await this.db.collection('servers')
    .doc(this.guildID)
    .collection('knife')
    .where('member_id','==', this.clientID)
    .get()
  }

  async setKnife(doc,data){
    await this.db.collection('servers')
      .doc(this.guildID)
      .collection('knife')
      .doc(String(doc))
      .set(data)
  }

  async setKnifeToAtk(doc){
    await this.db.collection('servers')
     .doc(this.guildID)
     .collection('knife')
     .doc(String(doc))
     .update({status: "attacking"})
  }

  async setKnifeToProcessing(doc){
    await this.db.collection('servers')
    .doc(this.guildID)
    .collection('knife')
    .doc(String(doc))
    .update({status: "processing"})
  }

  async setSL(){
      let query = await this.db.collection('servers')
      .doc(this.guildID)
      .collection('member')
      .doc(this.clientID)

      let data = await query.get()
      if(data.exists){
          await query.update({
            SL: true
          })
      }
    }
}

module.exports = NewDatabaseManager