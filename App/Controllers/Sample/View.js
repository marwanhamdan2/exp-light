module.exports = function(req, res){
    res.render('view1', {
        x: 5, 
        y: 6
    });
}