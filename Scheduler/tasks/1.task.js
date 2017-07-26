var fs = require('fs');
module.exports = {
  trigger : '*/1 * * * *', //corn job style,
  description: 'Task 1',
  action: function(){
    fs.appendFileSync('./hello', "\n" + new Date());
  }
}