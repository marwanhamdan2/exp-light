module.exports = {
    WEB_SERVER_PORT : process.env.PORT || 8020,
    TOKEN : 'QcG6kP3yDnUHD67hWAAQyqrDdFm4gBPW',
    BASE_URL : process.env.BASE_URL || 'http://127.0.0.1',
    API_URL : process.env.API_URL || 'http://127.0.0.1',
    CACHE_HOST : process.env.CACHE_HOST || '127.0.0.1',
    CACHE_PORT : Number( process.env.CACHE_PORT ) || 6379,
    CACHE_EXPIRE : Number( process.env.CACHE_EXPIRE  ) || 60,
    SITEMAP_PAGE_LIMIT: 1000,
    DB_SOURCE: {
        COUNT : 1,
        DB_SERVER_1 : {
            host_read     : '127.0.0.1',
            host_write    : '127.0.0.1',
            user     : 'root',
            password : '12345',
            database : 'datax'
        },
        DB_SERVER_DEFAULT : {
            host_read     : '127.0.0.1',
            host_write    : '127.0.0.1',
            user     : 'root',
            password : '12345',
            database : 'datax'
        }
    }
}