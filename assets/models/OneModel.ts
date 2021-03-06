declare var db1: any
declare var validator: any
declare var _start: any

class OneModel { // testable crud and fake flag, heavy work. view-model

   entityName: string = 'table_one2' //name of the collection in DB
   dataSourceType: string = 'real'  //real or fake
   form

   read(ctx, cb){
      console.log('- reading...', Date.now() - _start)

      if(this.dataSourceType=='fake') {
         let rows = [
            {id:1, col1:" Bob11", col2:"Bob12"},
            {id:2, col1:" Bob21", col2:"Bob22"},
            {id:3, col1:" Bob31", col2:"Bob32"}
         ]
         cb(rows, ctx)
         return
      }

      const ref = db1.collection(this.entityName)
      ref
         .get()
         .then(function(querySnapshot) {
            let rows = []
            querySnapshot.forEach(function(doc) {
               let row = doc.data()
               row['id'] = doc.id
               rows.push(row)  
            })
            cb(rows, ctx)
         })
      .catch(function(error) {
         console.log("Error getting documents: ", error)
      })
   }//()

   add( row, cb ) { //resolve, reject) {
      if(row.id) delete row.id // that should not be there on add

      let newPK = db1.collection(this.entityName).doc() // make PK
      newPK.set(row) // insert
         .then(function() { 
            console.log('successful')
            if(cb) cb(1)
         })
      .catch(function(error) {
         console.error('oops', error)
      })
   }//()

   update( row, cb ) { //resolve, reject) {
      console.log(row)
      let id = row['id']
      console.log(id, row)
      delete row.id // we are not save pk in a row

      let ref = db1.collection(this.entityName).doc(id)
      ref.set(row) // save
         .then(function() { 
            console.log('successful')
            if(cb) cb(1)//1 = ok
         })
      .catch(function(error) {
         console.error('oops', error)
      })
      return id

   }//()

   delete(row){
      let id = row['id']

      let ref = db1.collection(this.entityName).doc(id)
      ref.delete() // delete
         .then(function() { 
            console.log('successfully deleted')
         })
      .catch(function(error) {
         console.error('oops', error)
      })
   }

   valid(row) {
      console.log(row)
      let col1 = row['col1']
      let col2 = row['col2']
      if(validator.isEmpty(col1, { ignore_whitespace: true }) )
         return 'Col1 is blank'
      if(validator.isEmpty(col2, { ignore_whitespace: true }) )
         return 'Col2 is blank'
      return 'OK'
   }

   countData(cb){
      let c = 0;
      if(this.dataSourceType=='fake') {
         let cnt = 100;
         return cnt;
      }

      const ref = db1.collection(this.entityName)
      ref
         .get()
         .then(function(querySnapshot) {
            let rows = []
            querySnapshot.forEach(function(doc) {
               let row = doc.data()
               row['id'] = doc.id
               rows.push(row)
            })
            c = rows.length
            console.log("Count Data:", c)
            cb(c)
         }) 
   }//()

}
