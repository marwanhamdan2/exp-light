var schedule = require('node-schedule');
var glob = require('glob');

var jobsList = [];

glob('Scheduler/tasks/*.task.js', function(er, files){
  files.forEach(file=>{
    var taskPath = __dirname + "/../" + file;
    var job = require(taskPath);

    var jobAction = job.action;
    var jobTrigger = job.trigger;
    var jobDescription = job.description;

    if(jobTrigger && jobAction){
      var jobScheduler = schedule.scheduleJob(jobTrigger, jobAction);

      jobsList.push({
        description : jobDescription,
        trigger: jobTrigger,
        jobScheduler: jobScheduler
      });
    }
  });

  jobsList.forEach(_job=>{
    console.log(`${_job.trigger} ==> ${_job.description}`);
  })
});


/**
 * Handle parent process exit
 */
process.stdin.resume();

function exitHandler(){
  console.log("handle process exit");
  jobsList.forEach(_job=>{
    if(_job.jobScheduler){
      _job.jobScheduler.cancel();
    }
  })
}
process.on('exit', exitHandler.bind(null,{cleanup:true}));
process.on('SIGINT', exitHandler.bind(null, {exit:true}));
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));
