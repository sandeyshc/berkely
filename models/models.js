var mongoose = require('mongoose');

var movieSchema = new mongoose.Schema({
	name: String,
	rating: Number,
    cast:Array,
    Genre:String,
	releaseDate: {
		type: Date,
		default: Date.now
	}
	
});

var Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;