var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = 'postgres://localhost:5432/patients';
var db = pgp(connectionString);

function getAllPatients(req, res, next) {
   console.log("Inside getAllPatients");
  db.any('select * from patients')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL patients'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getSinglePatient(req, res, next) {
  var id = parseInt(req.params.id);
  db.one('select * from patients where id = $1', id)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ONE patient'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function createPatient(req, res, next) {
  req.body.age = parseInt(req.body.age);
  console.log(req.body);
  db.none('insert into patients(name,age, sex,ethnicity,race,dob,contact_person_name,contact_person_phone,mrn,phone,address,communication,marital_status,profile_img) values( ${name},${age},${sex},${ethnicity},${race},${dob},${contact_person_name},${contact_person_phone},${mrn},${phone},${address},${communication},${marital_status},${profile_img})',  req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted ONE patient'
        });
    })
    .catch(function (err) {
      console.trace("I am here");
      console.error(err);
      return next(err);
    });
}

function updatePatient(req, res, next) {
  db.none('update patients set name=$1, age=$2, sex=$3,ethnicity=$4,race=$5,dob=$6,contact_person_name=$7,contact_person_phone=$8,mrn=$9,phone=$10,address=$11,communication=$12,marital_status=13 ,profile_img=14 where id=$15',
    [req.body.name,parseInt(req.body.age), 
      req.body.sex, req.body.ethnicity, req.body.race,req.body.dob,req.body.contact_person_name,
      req.body.contact_person_phone, req.body.mrn, req.body.phone,req.body.address,req.body.communication,req.body.marital_status, req.body.profile_img,parseInt(req.params.id)])
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Updated patient'
        });
    })
    .catch(function (err) {
      console.error(err);
      return next(err);
    });
}

function removePatient(req, res, next) {
  var id = parseInt(req.params.id);
  db.result('delete from patients where id = $1', id)
    .then(function (result) {
      /* jshint ignore:start */
      res.status(200)
        .json({
          status: 'success',
          message: `Removed ${result.rowCount} patient`
        });
      /* jshint ignore:end */
    })
    .catch(function (err) {
      console.error(err);
      return next(err);
    });
}

function getAllPatientsSearchByName(req, res, next) {
  console.log(req.query.q);
  db.any("select * from patients where name like '%' || $1 || '%' ",req.query.q)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL patients'
        });
    })
    .catch(function (err) {
      console.error(err);
      return next(err);
    });
}


module.exports = {
  getAllPatients: getAllPatients,
  getSinglePatient: getSinglePatient,
  createPatient: createPatient,
  updatePatient: updatePatient,
  removePatient: removePatient,
  getAllPatientsSearchByName: getAllPatientsSearchByName
};
