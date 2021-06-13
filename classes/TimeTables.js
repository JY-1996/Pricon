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
        this.documents[i]['datas'][j]['time'] = await this.stringToTime(this.documents[i]['datas'][j]['time'])
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
      let str = String(String(i+1) + ". " + table['phase']) + "階" + String(table['boss']) + "王 " + "[" + table['name'] + '][.]\n'
      // let str = this.document_ids[i]
      strs += str
    }
    strs += '\n```'
    return strs;
  }

  getTable(num){
    if(this.documents[num]){
      let strs = ""
      for(let i=0;i<Object.keys(this.documents[num]['datas']).length;i++){
        let line = this.documents[num]['datas'][i]
        let str = String(line['time'] + " " + line['comment'] + "\n")
        strs += str
      }
      return strs
    }
    else {
      return "Invalid number"
    }
  }

  getShiftedTable(num,shift){
    if(this.documents[num]){
      let strs = ""
      for(let i=0;i<Object.keys(this.documents[num]['datas']).length;i++){
        let str = ""
        let line = this.documents[num]['datas'][i]
        let time = parseInt(line['time'])
        if(time-shift >= 0){
          if(time-shift >= 60){
            let shifted_time = "1." + String(time - shift - 60).padStart(2, '0')
            str = String(shifted_time + " " + line['comment'] + "\n")
          }else{
            str = String(time-shift + " " + line['comment'] + "\n")
          }
        }
        strs += str
      }
      return strs
    }
    else {
      return "Invalid number"
    }
  }
}

module.exports = TimeTables