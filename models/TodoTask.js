const mongoose = require('mongoose');
var todoTaskSchema = new mongoose.Schema({

   content:{type:String},
   due:{type:String},
   status:{type:String},
   label:{type:String}


});


module.exports = mongoose.model('TodoTask',todoTaskSchema);