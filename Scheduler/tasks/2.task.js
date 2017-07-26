var fs = require('fs');
module.exports = {
  trigger : '*/3 * * * *', //corn job style,
  description: 'Task 2',
  action: function(){
    fs.appendFileSync('./hello2', "\n" + new Date());
  }
}