var express = require('express');
var snmp = require('net-snmp')
var router = express.Router();

/* GET home page. */
router.get('/process', (req, res) => {
    var oid = "1.3.6.1.2.1.25.4.2";
    var columns = [2, 6];
    var list = []

    var process_type = {
        '1':'unknown', 
        '2':'operatingSystem', 
        '3':'deviceDriver', 
        '4':'application'
    }

    var session = snmp.createSession(req.query.ip, "public", {
        "version": snmp.Version2c,
        "port": req.query.port
    })

    
    session.tableColumns(oid, columns, 100, (err, table) => {
        if(!err){
            for(var process in table){
                var proc = {   
                    "name": table[process]['2'].toString(),
                    "type": process_type[table[process]['6'].toString()],
                    "id": process
                }                  
                list.push(proc)
            }
            res.jsonp(list)
        }
        else
            res.jsonp(err)
    })
});


router.get('/cpu', (req, res) => {
    var oids = [
        "1.3.6.1.2.1.25.5.1.1.1." + req.query.process,
        "1.3.6.1.2.1.25.5.1.1.2." + req.query.process,
        "1.3.6.1.2.1.1.3.0"
    ]

    var session = snmp.createSession(req.query.ip, "public", {
        "version": snmp.Version2c,
        "port": req.query.port
    })

    session.get(oids, (err, data) => {
        if(!err){
            res.set('Content-Type', 'application/json')
            res.set('Access-Control-Allow-Origin', '*')
            res.jsonp(data)
            console.log(data)
        }
        else
            res.jsonp(err)
    })
});

module.exports = router;
