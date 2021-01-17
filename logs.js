const pool = require("./pool");
const moment = require('moment')
moment.locale('ru')

const log = async function (type, req, recordId) {
    const time = moment().format("LTS")
    const date = moment().format("LL")
    const cookieEmail = req.cookies.email

    const [rows] = await pool.query(`INSERT INTO logs (record_id,email,time,date,log_type)
    VALUES (
    '${req.params.id || req.body.id || recordId}',
    '${req.session.email || cookieEmail}',
    '${time}',
    '${date}',
    '${type}')
    `);
};

module.exports = log;
