var queryRunner = require('../../Utils/Database/QueryRunner');

module.exports = {
    fetchDepartments: function(){
        return queryRunner.runQuery('default',`
            SELECT * FROM DEPARTMENT
        `, 'read', 'true');
    },

    fetchDepartmentEmployees: function(deptId){
        var query = `
            select * 
            from employees
            where dept_id=?
        `;
        var queryParams = [deptId];
        return queryRunner.runQueryWP(1, query, queryParams, 'read');
    }
}