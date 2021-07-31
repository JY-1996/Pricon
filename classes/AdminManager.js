class AdminManager {

  constructor(db,guildID) {
    this.db = db
    this.guildID = guildID
  }

  async setupGuildSetting(){
    await this.db.collection('servers')
    .doc(this.guildID)
    .set({setup: true})
    const queryRef = await this.db.collection('servers')
    .doc(this.guildID)
    .collection('setting')
    .doc('boss_max_hp')
    let query = queryRef.get() 
    if(!query.exist){
      await queryRef.set({
        1:[600,800,1000,1200,1500],
        2:[600,800,1000,1200,1500],
        3:[700,900,1200,1500,2000],
        4:[1700,1800,2000,2100,2200],
        5:[8500,9000,9500,10000,11100]
      })
    }
    const query1Ref = this.db.collection('servers')
    .doc(this.guildID)
    .collection('setting')
    .doc('boss')
    let query1 = query1Ref.get() 
    if(!query1.exist){
      await query1Ref.set({
        total_boss_died: 0,
        current_boss_hp: 600,
        knife_count: 3
      })
    }
  }

  async resetBoss(current_week,current_boss){
    const queryRef = this.db.collection('servers')
    .doc(this.guildID)
    .collection('setting')
    .doc('boss')
    const boss_max_hp = await this.db.collection('servers')
    .doc(this.guildID)
    .collection('setting')
    .doc('boss_max_hp')  
    .get()                
    let query = await queryRef.get() 
    let current_phase = 1
    if(current_week > 44){
      current_phase = 5
    }else if(current_week > 34){
      current_phase = 4
    }else if(current_week > 10){
      current_phase = 3
    }else if(current_week > 3){
      current_phase = 2
    }

    await queryRef.update({
      total_boss_died: (current_week - 1) * 5 + current_boss - 1,
      current_boss_hp: boss_max_hp.data()[current_phase][current_boss == 5 ? 0 : current_boss]
    })                
  }

  async resetBossHp(new_hp){
    const queryRef = this.db.collection('servers')
    .doc(this.guildID)
    .collection('setting')
    .doc('boss')
            
    await queryRef.update({
      current_boss_hp: new_hp
    })                
  }

  async cancelMemberKnife(member,boss){
    let query = await this.db.collection('servers')
    .doc(this.guildID)
    .collection('knife')
    .where('member_id','==', member)
    .where('boss','==', boss)
    .get()
    await query.forEach(doc => {
      this.deleteKnife(doc.id)
    })
  }

  async setKnifeCount(value){
    let queryRef =  this.db.collection('servers')
    .doc(this.guildID)
    .collection('setting')
    .doc('boss')
    let query = await queryRef.get()
    if(query.exists && query.data().knife_count){
      await queryRef.update({ knife_count: value})
    }else{
      await queryRef.set({ knife_count: value})
    }
  }

  async displayAllSetting(){
    return await this.db.collection('servers')
    .doc(this.guildID)
    .collection('setting')
    .get()
  }

  async deleteKnife(id){
    await this.db.collection('servers')
    .doc(this.guildID)
    .collection('knife')
    .doc(id)
    .delete()
  }

  async getAllGuild(){
    return await this.db.collection('servers')
    .get()
  }

  async deleteGuildKnife(guildID, batchSize = 10) {

    const collectionRef = this.db
    .collection("servers")
    .doc(guildID)
    .collection("knife");
    const query = collectionRef.limit(batchSize);

      // Delete all existing knife reports
      return new Promise((resolve, reject) => {
       this._deleteQueryBatch(this.db, query, resolve).catch(reject);
     });
    };

    async _deleteQueryBatch(db, query, resolve) {
      const snapshot = await query.get();

      const batchSize = snapshot.size;
      if (batchSize == 0) {
         // When there are no documents left, we are done
         resolve();
         return;
       }

      // Delete documents in a batch
      const batch = db.batch();
      snapshot.docs.forEach((doc) => {
       batch.delete(doc.ref);
     });
      await batch.commit();

      // Recursion on the next process tick, to avoid exploding the stack.
      process.nextTick(() => {
       this._deleteQueryBatch(db, query, resolve);
     });
    }

    async getMemberKnifeData(member_id){
      return await this.db.collection('servers')
      .doc(this.guildID)
      .collection('knife')
      .where('member_id', '==', member_id)
      .get()
    }
  }

  module.exports = AdminManager