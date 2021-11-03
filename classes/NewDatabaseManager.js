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
			let new_hp = current_boss_hp - hp
			if(new_hp <= 0){
				let new_max_hp = boss_max_hp[this.checkPhase(total_boss_died)]
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

	checkPhase(total_boss_died){
		if(total_boss_died > 40){
  			return 4
		}else if(total_boss_died > 30){
  			return 3
		}else if(total_boss_died > 10){
  			return 2
		}else if(total_boss_died > 3){
  			return 1
		}else{
			return 0
		}	
	}
}

module.exports = NewDatabaseManager