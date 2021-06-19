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

  // timeToString(inp){
  //   let input = parseInt(inp)
  //   let str = ""
  //   let sec = input
  //   let min = 0
  //   console.log(input)
  //   console.log(sec)
  //   if(input >= 60){
  //     while(sec >= 60){
  //       sec = sec - 60
  //       min += 1
  //     }
  //     console.log(min)
  //     console.log(sec)
  //   }
  //   if(min > 0){
  //     return String(min) + "." + String(sec).padStart(2, '0')
  //   }else{
  //     return String(sec)
  //   }
  // }
  timeToString(time,shift){
    let min = parseInt(time)
    if(min >= 100){
      min = min - 100 + 60
    }
    let final = min - shift
    if(final > 60){
      final = final - 60 + 100
    }
    return final
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
        let str = String(this.timeToString(line['time'],0) + " " + line['comment'] + "\n")
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
          str = String(this.timeToString(time,shift) + " " + line['comment'] + "\n")
        }
        strs += str
      }
      return strs
    }
    else {
      return "Invalid number"
    }
  }

  async getShifted(data,shift){
     let strs = ""
      for(let i=0;i<Object.keys(data).length;i++){
        let str = ""
        let line = data[i]
        let time = parseInt(line['time'])

        if(time-shift >= 0){
          str = String(this.timeToString(time,shift) + " " + line['comment'] + "\n")
        }
        strs += str
      }
      return strs
  }

  getTableID(num){
    if(this.document_ids[num]){
      return this.document_ids[num]
    }
    else{
      return;
    }
  }
}

module.exports = TimeTables