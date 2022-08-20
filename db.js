const Pool = require('pg').Pool;

const pool = new Pool({
    user: "user31",
    password: "carpediem31",
    port: 5432,
    database: "task"
});

module.exports = pool;