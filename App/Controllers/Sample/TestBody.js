module.exports = function(req, res){
  return res.json({
    reqBodyParsed: req.body
  })
}