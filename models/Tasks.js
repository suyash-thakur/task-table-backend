var mongoose = require('mongoose'),
 Schema = mongoose.Schema;

var taskSchema = new Schema({
    content: { type: String, isRequired: true },
})

module.exports = mongoose.model('Tasks', taskSchema);
