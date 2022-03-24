class DatabaseManager {

  constructor(db,guildID,clientID = null) {
    this.db = db
    this.guildID = guildID
    this.clientID = clientID
  }

  async setClientID(clientID){
    this.clientID = clientID
  }

  async getAllKnife(){
    return await this.db.collection('servers')
    .doc(this.guildID)
    .collection('knife')
    .orderBy('time')
    .get()
  }

  async getKnifeQuery(){
    return await this.db.collection('servers')
    .doc(this.guildID)
    .collection('knife')
    .where('member_id','==', this.clientID)
    .where('compensate','==', false)
    .get()
  }
  async getKnifeCount(){
    let memberData = await this.db.collection('servers')
    .doc(this.guildID)
    .collection('knife')
    .where('member_id','==', this.clientID)
    .get()
    let count = 0
    await memberData.forEach(doc => {
      let status = doc.data().status
      let compensate = doc.data().compensate
      if(status == 'done'){
        if(compensate){
          count += 0.5
        }else{
          count += 1
        }
      }
    })
    return count
  }

  async getAllKnifeQuery(){
    return await this.db.collection('servers')
    .doc(this.guildID)
    .collection('knife')
    .where('member_id','==', this.clientID)
    .get()
  }

  async getKnifeBossQuery(boss){
    return  await this.db.collection('servers')
    .doc(this.guildID)
    .collection('knife')
    .where('member_id','==', this.clientID)
    .where('boss','==', boss)
    .where('status','in', ['processing','attacking'])
    .get()
  }

  async getAllKnifeBossQuery(boss){
    return  await this.db.collection('servers')
    .doc(this.guildID)
    .collection('knife')
    .where('boss','==', boss)
    .where('status', 'in', ['processing','attacking'])
    .get()
  }

  async getAttackKnifeBossQuery(boss){
    return  await this.db.collection('servers')
    .doc(this.guildID)
    .collection('knife')
    .where('member_id','==', this.clientID)
    .where('boss','==', boss)
    .where('status','==','attacking')
    .get()
  }

  async setKnife(doc,data){
    await this.db.collection('servers')
    .doc(this.guildID)
    .collection('knife')
    .doc(String(doc))
    .set(data)
  }

  async updateKnifeToDone(id, current_boss){
    await this.db.collection('servers')
    .doc(this.guildID)
    .collection('knife')
    .doc(id)
    .update({
      status: 'done',
      compensate: false,
      kill: current_boss
    })
  }

  async updateKnifeToDoneWithCom(id,current_boss){
    await this.db.collection('servers')
    .doc(this.guildID)
    .collection('knife')
    .doc(id)
    .update({
      status: 'done',
      compensate: true,
      kill: current_boss
    })
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

  async getChannel(channel){
    let queryRef =  this.db.collection('servers')
    .doc(this.guildID)
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
   else if(channel == 'member_update'){
     return query.data().member_update
   }
   return false
 }

 async getBossDetail() {
  let queryRef = this.db.collection('servers')
  .doc(this.guildID)
  .collection('setting')
  .doc('boss')
  let query = await queryRef.get()
  const total_boss_died = query.data().total_boss_died
  const current_boss_hp = query.data().current_boss_hp
  const knife_count = query.data().knife_count

  const current_week = parseInt(total_boss_died / 5) + 1
  const current_boss = total_boss_died % 5 + 1
  let current_phase = 1
  if(current_week > 40){
    current_phase = 5
  }else if(current_week > 30){
    current_phase = 4
  }else if(current_week > 10){
    current_phase = 3
  }else if(current_week > 3){
    current_phase = 2
  }
  return {
    total_boss_died: total_boss_died,
    current_boss_hp: current_boss_hp,
    current_week: current_week,
    current_boss: current_boss,
    current_phase: current_phase,
    knife_count: knife_count
  }
};

async nextBoss(){
 let serverBossRef = this.db.collection('servers')
 .doc(this.guildID)
 .collection('setting')
 .doc('boss_max_hp')
 let serverBoss = await serverBossRef.get()
 const boss_max_hp = serverBoss.data()

 let reportBossRef = await this.db.collection('servers')
 .doc(this.guildID)
 .collection('setting')
 .doc('boss')
 let reportBoss = await reportBossRef.get()
 let total_boss_died = reportBoss.data().total_boss_died
 let next_boss = total_boss_died + 1
 const current_week = parseInt(next_boss / 5) + 1
 const current_boss = next_boss % 5
 let current_phase = 1
 if(current_week > 40){
  current_phase = 5
}else if(current_week > 30){
  current_phase = 4
}else if(current_week > 10){
  current_phase = 3
}else if(current_week > 3){
  current_phase = 2
}
await reportBossRef.update({
  current_boss_hp: boss_max_hp[current_phase][current_boss],
  total_boss_died: total_boss_died + 1
})

}

async updateBossHp(boss_hp){
  let query = await this.db.collection('servers')
  .doc(this.guildID)
  .collection('setting')
  .doc('boss')
  await query.update({
    current_boss_hp: boss_hp
  })
}

async getAllGuild(){
  return await this.db.collection('servers')
  .get()
}

async getMemberData(){
  return await this.db.collection('servers')
  .doc(this.guildID)
  .collection('knife')
  .get()
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

    async setSL(member_id,member_name,message){
      let query = await this.db.collection('servers')
      .doc(this.guildID)
      .collection('member')
      .doc(member_id)

      let data = await query.get()
      if(data.exists){
          await query.update({
            SL: true,
            SLmsg: message
          })
      }else{
          await query.set({
            SL: true,
            SLmsg: message,
            name: member_name,
            count: 0
          })
      }
    }

    async addKnifeCount(member_id,count,member_name){
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

    async tagFailMember(){
       return await this.db.collection('servers')
      .doc(this.guildID)
      .collection('member')
      .where('count','!=',3)
      .get()
    }
}

module.exports = DatabaseManager
