
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.coffelog = function(db) {
    return function(req, res) {
        var collection = db.get('coffes');
        collection.find({},{},function(e,docs){
					var coffelog=JSON.stringify(docs)
            res.render('coffelog', {
                coffelog : docs
            });
        });
    };
};