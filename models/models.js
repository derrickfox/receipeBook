var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var receipeSchema = new mongoose.Schema({
    receipeName: String,		//should be changed to ObjectId, ref "User"
    receipeDescription: String
});


mongoose.model('Receipe', receipeSchema);
