var mongoose = require('mongoose'),
 Schema = mongoose.Schema;

var statusSchema = new Schema({
    title: { type: String, isRequired: true },
    cards: { type: [Schema.Types.ObjectId], ref: 'Tasks' },
})

module.exports = mongoose.model('Status', statusSchema);
