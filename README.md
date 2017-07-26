# exp-light
Nodejs Web Framework based on Expressjs


#Install Dependencies
npm Install

#run
node index.js


#Migration 
<br />
** Help <br />
cd sequelize; ../node_modules/.bin/sequelize help

** create Migration file <br />
cd sequelize; ../node_modules/.bin/sequelize migration:create

** list pending migrations <br />
NODE_ENV=production npm run migration-list

** run migrations <br />
NODE_ENV=production npm run migration-start

** undo migrations <br />
NODE_ENV=production npm run migration-undo




**More: http://docs.sequelizejs.com/manual/tutorial/migrations.html