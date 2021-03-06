const express = require("express");
const pool = require("../pool");
const authorization = require("../authorization");
const createError = require("http-errors");
const exportFromJSON = require('export-from-json')
const router = express.Router();

router.get("/", authorization, async (req, res) => {
    const logs = [rows] = await pool.query(`SELECT * FROM logs`);
    const deletedIds = [rows] = await pool.query(`SELECT record_id FROM logs WHERE log_type=0`);
    const deletedIdsArr = deletedIds[0].map(function (item) {
        return item.record_id
    })
    res.status(200).send({ logs: logs[0].reverse(), idsArr: deletedIdsArr })
});

router.get("/:fileFormat", authorization, async (req, res) => {
    const [rows] = await pool.query(`SELECT * FROM crossWords`);
    const data = rows;
    const fileName = 'crossWords'
    const exportType = `${req.params.fileFormat}`

    const result = exportFromJSON({
        data,
        fileName,
        exportType,
        processor (content, type, fileName) {
            switch (type) {
                case 'txt':
                    res.setHeader('Content-Type', 'text/plain')
                    break
                case 'json':
                    res.setHeader('Content-Type', 'text/plain')
                    break
                case 'csv':
                    res.setHeader('Content-Type', 'text/csv')
                    break
                case 'xls':
                    res.setHeader('Content-Type', 'application/vnd.ms-excel')
                    break
            }
            res.setHeader('Content-disposition', 'attachment;filename=' + fileName)
            return content
        }
    })

    res.write(result)
    res.end()
});

module.exports = router;
