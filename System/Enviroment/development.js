module.exports = {
    NAME: 'development',
    WEB_SERVER_PORT : process.env.PORT || 8020,
    TOKEN : 'QcG6kP3yDnUHD67hWAAQyqrDdFm4gBPW',
    BASE_URL : process.env.BASE_URL || 'http://127.0.0.1',
    API_URL : process.env.API_URL || 'http://127.0.0.1',
    CACHE_HOST : process.env.CACHE_HOST || '127.0.0.1',
    CACHE_PORT : Number( process.env.CACHE_PORT ) || 6379,
    CACHE_PASSWORD: process.env.CACHE_PASSWORD || null,
    CACHE_EXPIRE : Number( process.env.CACHE_EXPIRE ) || 60 * 60 * 6, // 6 hours
    SITEMAP_PAGE_LIMIT: 1000,
    DEBUG: process.env.ENV_DEBUG || true, 
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
    },
    USE_QUERY_CACHE: process.env.USE_QUERY_CACHE || 'true',
    QUERY_CACHE_CONFIG:{
        engine: 'redis',
        ttl: Number( process.env.L2_CACHE_EXPIRE) || 3600, //1 hour
        redis:{
            host: process.env.CACHE_HOST || '127.0.0.1',
            port: Number( process.env.CACHE_PORT ) || 6379,
            password: process.env.CACHE_PASSWORD || '',
        },
        file:{
            tmpDir: './cache_tmp'
        },
        memory:{
        }
    }
}