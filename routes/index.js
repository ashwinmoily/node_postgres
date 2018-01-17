var express = require('express');
var router = express.Router();
var db = require('../queries');


router.get('/api/patients/search/' ,db.getAllPatientsSearchByName);

router.get('/api/patients', db.getAllPatients);
router.get('/api/patients/:id', db.getSinglePatient);

router.post('/api/patients', db.createPatient);
router.put('/api/patients/:id', db.updatePatient);
router.delete('/api/patients/:id', db.removePatient);

// application -------------------------------------------------------------
router.get('/', function (req, res) {

    res.render('index', {title: 'node-postgres-promises'}); // load the single view file (angular will handle the page changes on the front-end)
});

module.exports = router;
