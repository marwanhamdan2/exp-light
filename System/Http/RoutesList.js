/**
 * Routes list
 */
module.exports = [
    {
        'verb' : 'get',
        'route' : '/v1/departments',
        'controllerAction' : 'Sample/Departments',
        'middlewares' : ['Token'],
        'useCache' : false,
        'swaggerDocs' : {
            description : "department list api",
            produces : ["application/json"],
            params : [
                { "in" : "query",  "name" : "_t",    "type" : "string" }
            ]
        }
    },

    {
        'verb' : 'get',
        'route' : '/v1/department/:id/employees',
        'controllerAction' : 'Sample/DepartmentEmployees',
        'middlewares' : ['Token'],
        'useCache' : false,
        'swaggerDocs' : {
            description : "employees search api",
            produces : ["application/json"],
            params : [
                { "in" : "query",  "name" : "_t",    "type" : "string" },
                { "in" : "path",   "name" : "id",    "type" : "string" },
                { "in" : "header", "name" : "auth",  "type" : "string" }
            ]
        }
    },

    {
        'verb' : 'post',
        'route' : '/api/login',
        'controllerAction' : 'Sample/Login',
        'middlewares' : [],
        'useCache' : false,
        'swaggerDocs' : {
            description : "employees search api",
            produces : ["application/json"],
            consumes: [ "application/json" ],
            params : [
                { "in" : "header", "name" : "auth",  "type" : "string" },
                { "in" : "body", "params" : ['email', 'password'] }
            ]
        }        
    }
]
