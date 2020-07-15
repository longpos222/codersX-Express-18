var db = require("../db");
var shortid = require("shortid");

module.exports.usersList = function(req, res) {
  res.render("users/users-list", {
    usersList: db.get("usersList").value()
  });
};

module.exports.add = function(req, res) {
  res.render("users/add");
};

module.exports.addPOST = function(req, res) {
  var id = shortid();
  db.get("usersList")
    .push({ id: id, name: req.body.name, phone: req.body.phone })
    .value();
  db.get("usersList").write();
  res.redirect("/users");
};

module.exports.update = function(req, res) {
  res.render("users/update-name", {
    currentNameID: req.params.id,
    currentName: db
      .get("usersList")
      .find({ id: req.params.id })
      .value().name
  });
};

module.exports.delete = function(req, res) {
  var id = req.params.id;
  db.get("usersList")
    .remove({ id: id })
    .write();
  res.redirect("/users");
};

module.exports.updatePOST = function(req, res) {
  var id = req.params.id;
  db.get("usersList")
    .find({ id: id })
    .assign({ name: req.body.name })
    .write();
  res.redirect("/users");
};
