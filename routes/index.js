var express = require('express');
var router = express.Router();
var axios = require('axios')

/* GET home page. */
router.get('/', (req, res) => {
    if (req.query.ip && req.query.port)
    axios.get('http://127.0.0.1:3000/api/process')
        .then(data => {
            res.render('index', { 
                process_list: data.data,
                host: req.query 
            })
        })
        .catch(err => {
            res.render('error', { error: err })
        })
    else
        res.render('index', { process_list: [] })
});

router.get('/realtime/', (req, res) => {
    res.render('realtime', {
        target_: JSON.stringify(req.query)
    })
})

module.exports = router;
