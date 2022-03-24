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
    .doc(this.clientID)
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

  async getAllKnifeAtkQuery(){
    return await this.db.collection('servers')
    .doc(this.guildID)
    .collection('knife')
    .where('member_id','==', this.clientID)
    .where('status','==', 'attacking')
    .get()
  }

  async getAllKnifeProcessingAtkQuery(){
    return await this.db.collection('servers')
    .doc(this.guildID)
    .collection('knife')
    .where('member_id','==', this.clientID)
    .where('status','in', ['attacking', 'processing'])
    .get()
  }

  async getAllKnifeDoneQuery(){
    return await this.db.collection('servers')
    .doc(this.guildID)
    .collection('knife')
    .where('member_id','==', this.clientID)
    .where('status','==', 'done')
    .get()
  }

  async setKnife(doc,data){
    await this.db.collection('servers')
    .doc(this.guildID)
    .collection('knife')
    .doc(String(doc))
    .set(data)
  }

  async deleteKnife(id){
    await this.db.collection('servers')
    .doc(this.guildID)
    .collection('knife')
    .doc(id)
    .delete()
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

  async setKnifeToDone(doc){
    await this.db.collection('servers')
    .doc(this.guildID)
    .collection('knife')
    .doc(String(doc))
    .update({status: "done"})
  }

  async addKnifeCount(member_id, member_name, count){
    let query = await this.db.collection('servers')
    .doc(this.guildID)
    .collection('member')
    .doc(member_id)

    let data = await query.get()
    if(data.exists){
      let number = data.data().count
      let total = number + count
      if(total > 3){
        total = 3
      }
      await query.update({
        count: total
      })
    }else{
      await query.set({
        SL: false,
        name: member_name,
        count: count
      })
    }
  }

  async setBossHp(boss, hp){
    let query = await this.db.collection('servers')
    .doc(this.guildID)
    .collection('boss')
    .doc(String(boss))

    let data = await query.get()
    if(data.exists){
      let boss_max_hp = data.data().boss_max_hp
      let current_boss_hp = data.data().current_boss_hp
      let total_boss_died = data.data().total_boss_died
      let new_week = total_boss_died + 2
      let new_hp = current_boss_hp - hp
      if(new_hp <= 0){
        let new_max_hp = boss_max_hp[this.checkPhase(new_week)]
        await query.update({
          total_boss_died: total_boss_died + 1,
          current_boss_hp: new_max_hp
        })
        return {
          status: "died",
          week: total_boss_died + 2
        }
      }else{
        await query.update({
          current_boss_hp: new_hp
        })
        return {
          status: "damage",
          hp: new_hp
        }
      }
    }
    return {
      status: "fail"
    }
  }

  async setBossDied(boss){
    let query = await this.db.collection('servers')
    .doc(this.guildID)
    .collection('boss')
    .doc(String(boss))

    let data = await query.get()
    if(data.exists){
      let boss_max_hp = data.data().boss_max_hp
      let current_boss_hp = data.data().current_boss_hp
      let total_boss_died = data.data().total_boss_died
      let new_week = total_boss_died + 2
      let new_max_hp = boss_max_hp[this.checkPhase(new_week)]
      await query.update({
        total_boss_died: total_boss_died + 1,
        current_boss_hp: new_max_hp
      })
      return true
    }
    return false
  }

  async setSL(message){
    let query = await this.db.collection('servers')
    .doc(this.guildID)
    .collection('member')
    .doc(this.clientID)

    let data = await query.get()
    if(data.exists){
      await query.update({
        SL: true,
        SLMsg: message
      })
    }
  }

  async checkAtkAvailable(boss){
    let query = await this.db.collection('servers')
    .doc(this.guildID)
    .collection('boss')
    .get()
    let min = 0
    let curr = 0
    if(!query.empty){
      await query.forEach(doc => {
        let week = doc.data().total_boss_died
        if(min == 0 || week < min){
          min = week
        }
        if(doc.id == boss){
          curr = week
        }
      })
    }
    if(['2','9','29','39'].includes(min)){
      if(curr == min){
        return true
      }else{
        return false
      }
    }
    //curr cannot more than min + 2
    if(curr > min + 1){
      return false
    }
    return true
  }

  async getAllBoss(){
    return await this.db.collection('servers')
    .doc(this.guildID)
    .collection('boss')
    .get()
  }

  async getAllProcessingKnife(){
    return await this.db.collection('servers')
    .doc(this.guildID)
    .collection('knife')
    .where("status", "!=", "done")
    .get()
  }

  async tagFailMember(){
    return await this.db.collection('servers')
    .doc(this.guildID)
    .collection('member')
    .where('count','!=',3)
    .get()
  }

  async createNewReport(member,message,time){
    let query = this.db.collection('servers')
    .doc(this.guildID)
    .collection('report')
    .doc(this.clientID)
    let data = await query.get()
    if(data.exists){
      await query.update({
        message: message,
        time: time
      })
    }else{
      await query.set({
        clientName: member,
        message: message,
        time: time
      })
    }
  }

  async getReport(){
    return await this.db.collection('servers')
    .doc(this.guildID)
    .collection('report')
    .orderBy('time')
    .get()
  }

  async deleteReport(){
    const batch = this.db.batch();
    let report = await this.db.collection('servers')
    .doc(this.guildID)
    .collection('report')
    .get()
    report.forEach((doc) => {
      batch.delete(doc.ref)
    })
    await batch.commit();
  }

  checkPhase(current_week){
    if(current_week > 40){
      return 4
    }else if(current_week > 30){
      return 3
    }else if(current_week > 10){
      return 2
    }else if(current_week > 3){
      return 1
    }else{
      return 0
    }
  }
}

module.exports = NewDatabaseManager
