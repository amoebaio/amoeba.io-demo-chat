var MemoryStorage = function() {
    this.data = {};
};

MemoryStorage.prototype.get = function(key, callback) {
	if(callback){
    	callback(null, this.data[key]);
	}
};
MemoryStorage.prototype.set = function(key, value, callback) {
    this.data[key] = value;
    if(callback){
    	callback(null, value);
	}
};
MemoryStorage.prototype.del = function(key, callback) {
    delete this.data[key];
	if(callback){
    	callback(null, key);
	}

};

exports = module.exports = MemoryStorage;
