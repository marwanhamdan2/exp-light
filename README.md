# exp-light #
Nodejs Web Framework based on Expressjs


# Install Dependencies #
```javascript
npm Install
```

# install ssl certs #
you need to have openssl installed
```
npm run generate-ssl-cert
```

# run #
```javascript
npm start
```

# run in cluster mode #
```javascript
CLUSTER_NUM=2 npm run start-cluster-mode
```

# run unit tests #
add new test case into ./test folder
```javascript
npm test
```

# Migration #
* #####  Help ##### 
``` cd sequelize; ../node_modules/.bin/sequelize help ```

* ##### create Migration file ##### 
``` cd sequelize; ../node_modules/.bin/sequelize migration:create ```

* ##### list pending migrations  ##### 
``` NODE_ENV=production npm run migration-list ```

* #####  run migrations ##### 
``` NODE_ENV=production npm run migration-start ```

* #####  undo migrations ##### 
``` NODE_ENV=production npm run migration-undo ```

* More: http://docs.sequelizejs.com/manual/tutorial/migrations.html

# Scheduler 

* Define tasks at ~project/Scheduler/tasks. Name must be like *.task.js.
*  the task export object contains (description, trigger-corn-like, action-function).
*  Run using: ``` npm run run-Scheduler ```