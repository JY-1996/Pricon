class ChannelManager {

  constructor(db,guildID) {
      this.db = db
      this.guildID = guildID
  }

  async setKnifeChannel(value){
      let queryRef =  this.db.collection('servers')
                        .doc(this.guildID)
                        .collection('setting')
                        .doc('channel')
      let query = await queryRef.get()
      if(query.exists && query.data().knife){
          await queryRef.update({ knife: value})
      }else{
          await queryRef.set({ knife: value },{ merge: true })
      }
  }

  async setLogChannel(value){
      let queryRef =  this.db.collection('servers')
                        .doc(this.guildID)
                        .collection('setting')
                        .doc('channel')
      let query = await queryRef.get()
      if(query.exists && query.data().log){
          await queryRef.update({ log: value})
      }else{
          await queryRef.set({ log: value},{ merge: true })
      }
  }

  async setReportChannel(value){
      let queryRef =  this.db.collection('servers')
                        .doc(this.guildID)
                        .collection('setting')
                        .doc('channel')
      let query = await queryRef.get()
      if(query.exists && query.data().report){
          await queryRef.update({ report: value})
      }else{
          await queryRef.set({ report: value},{ merge: true })
      }
  }

  async setMemberUpdateChannel(value){
      let queryRef =  this.db.collection('servers')
                        .doc(this.guildID)
                        .collection('setting')
                        .doc('channel')
      let query = await queryRef.get()
      if(query.exists && query.data().report){
          await queryRef.update({ member_update: value})
      }else{
          await queryRef.set({ member_update: value},{ merge: true })
      }
  }

   async getReportMessage(){
      let queryRef =  this.db.collection('servers')
                        .doc(this.guildID)
                        .collection('setting')
                        .doc('channel')
      let query = await queryRef.get()
      if(query.exists && query.data().board_message){
          return query.data().board_message
      }
      return false
    }

    async setReportMessage(value){
      let queryRef =  this.db.collection('servers')
                        .doc(this.guildID)
                        .collection('setting')
                        .doc('channel')
      let query = await queryRef.get()
      if(query.exists && query.data().report){
          await queryRef.update({ board_message: value})
      }else{
          await queryRef.set({ board_message: value},{ merge: true })
      }
    }

    async getMemberUpdateMessage(){
      let queryRef =  this.db.collection('servers')
                        .doc(this.guildID)
                        .collection('setting')
                        .doc('channel')
      let query = await queryRef.get()
      if(query.exists && query.data().member_update_board_message){
          return query.data().member_update_board_message
      }
      return false
    }

    async setMemberUpdateMessage(value){
      let queryRef =  this.db.collection('servers')
                        .doc(this.guildID)
                        .collection('setting')
                        .doc('channel')
      let query = await queryRef.get()
      if(query.exists && query.data().member_update_board_message){
          await queryRef.update({ member_update_board_message: value})
      }else{
          await queryRef.set({ member_update_board_message: value},{ merge: true })
      }
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

}

module.exports = ChannelManager