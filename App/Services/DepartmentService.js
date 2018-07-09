var queryRunner = require('../Utils/QueryRunner');

module.exports = {
  fetchDepartments: function(){
    var connection = 'default';
    var query = `
      SELECT * 
      FROM DEPARTMENT
    `;
    return queryRunner.runQuery(connection, query, null, 'read', 'true');
  },

  fetchDepartmentEmployees: function(deptId){
    var query = `
        select * 
        from employees
        where dept_id=?
    `;
    var queryParams = [deptId];
    return queryRunner.runQuery("emp_connection", query, queryParams, 'read');
  }
}