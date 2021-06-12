class TimeTables {

  constructor(db) {
    this.db = db
    this.documents = []
    this.document_ids = []
  };
    
  async getTimeTables(guildID) {
    await this.db.collection('servers').doc(guildID).collection('timetable').get().then(querySnapshot => {
      querySnapshot.docs.forEach(doc => {
      this.documents.push(doc.data());
      this.document_ids.push(doc.id)
      });
    });
    for(let i=0;i<this.documents.length;i++){
      
      this.documents[i]['datas'] = JSON.parse(this.documents[i]['data'])
      for(let j=0;j<Object.keys(this.documents[i]['datas']).length;j++){
        this.documents[i]['datas'][j]['time'] = this.stringToTime(this.documents[i]['datas'][j]['time'])
      }
    }
    return;
  };

  async stringToTime(inp) {
    let idx = inp.indexOf('.')
    let time = 0
    if (idx < 0) {
      idx = inp.indexOf(':')
    }
    if (idx < 0){
      time = parseInt(inp)
    } else {
      let front = inp.substring(0,idx)
      let back = inp.substring(idx+1,inp.length)
      time = parseInt(front)*60 + parseInt(back)
    }
    return time
  }

  async listTimeTables(guild) {
    let strs = '```markdown\n請選擇刀表\n=========\n'
    for(let i=0;i<this.documents.length;i++) {
      let table = this.documents[i]
      let str = String(String(i+1) + ". " + table['phase']) + "周" + String(table['boss']) + "王 " + "[" + table['name'] + '][.]\n'
      // let str = this.document_ids[i]
      strs += str
    }
    strs += '\n```'
    return strs;
  }
}

module.exports = TimeTables