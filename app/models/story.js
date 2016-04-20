var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StroySchema = new Schema({
	creator: {
		type: Schema.Types.Object, 
		ref: "user",
		content: String,
		created: {
			type: Date,
			defauly: Date.now
		}
	}
});

module.exports = mongoose.model("Story", StroySchema);