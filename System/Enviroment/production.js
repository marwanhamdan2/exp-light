module.exports = {
  NAME: 'production',
  DEBUG: process.env.ENV_DEBUG || true, 

  WEB_SERVER_PORT : process.env.PORT || 8020,
  OPEN_HTTPS: process.env.OPEN_HTTPS || 'false',
  HTTPS_SERVER_PORT: process.env.HTTPS_SERVER_PORT || 5020,


  TOKEN : 'QcG6kP3yDnUHD67hWAAQyqrDdFm4gBPW',
  BASE_URL : process.env.BASE_URL || 'http://127.0.0.1',

  REDIS_HOST : process.env.REDIS_HOST || '127.0.0.1',
  REDIS_PORT : Number( process.env.REDIS_PORT ) || 6379,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || null,
  REDIS_EXPIRE : Number( process.env.REDIS_EXPIRE ) || 60 * 60, //1 HOUR
  USE_HTTP_CACHE: process.env.USE_HTTP_CACHE || 'true',
  USE_QUERY_CACHE: process.env.USE_QUERY_CACHE || 'true',

  MYSQL_CONNECTIONS: {
    1 : {
      host_read     : '127.0.0.1',
      host_write    : '127.0.0.1',
      user     : 'root',
      password : '12345',
      database : 'emp_database'
    },
    default : {
      host_read     : '127.0.0.1',
      host_write    : '127.0.0.1',
      user     : 'root',
      password : '12345',
      database : 'datax'
    }
  },
}