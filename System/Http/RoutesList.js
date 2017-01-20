/**
 * Routes list
 */
module.exports = [
    {
        'verb' : 'get',
        'route' : '/v1/departments',
        'controllerAction' : 'Sample/Departments',
        'middlewares' : ['Token'],
        'useCache' : false 
    },

    /**
     * Example:
        localhost:web_server_port/v1/departments?_t=QcG6kP3yDnUHD67hWAAQyqrDdFm4gBPW
     */
    {
        'verb' : 'get',
        'route' : '/v1/department/:id/employees',
        'controllerAction' : 'Sample/DepartmentEmployees',
        'middlewares' : [],
        'useCache' : true 
    },
    /**
     * Example:
       localhost:web_server_port/v1/departments
     */
    {
        'verb' : 'get',
        'route' : '/v1/view',
        'controllerAction' : 'Sample/View',
        'middlewares' : [],
        'useCache' : false 
    },
]
