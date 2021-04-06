const db = require('../models');
const Account = db.accounts;
const Sentry = require('@sentry/node');

// Create and save a new Account
exports.create = (req, res) => {
  Sentry.setTag("action", "account-creation");
  
  Sentry.addBreadcrumb({
    category: "persistence",
    message: "creating account",
    level: Sentry.Severity.Info
  });

  if(!req.body.rewardsId) {
    res.status(400).send({ message: "Content cannot be empty!" });
    return;
  }

  // Create account
  const account = new Account({
    customerId: req.body.customerId,
    rewardsId: req.body.rewardsId,
    points: 0,
    status: "member"
  });

  let throwError = Math.floor(Math.random() * 10) % 3 ? true : false;

  if(throwError)
    account.points = "lots of points";

  account
    .save(account)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      Sentry.captureException(err);
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the account"
      });
    });
};

// Retrieve all accounts from the db
exports.findAll = (req, res) => {
  const status = req.query.status;
  let condition = status ? { status: { $regex: new RegExp(status), $options: "i" } } : {};
  
  Account.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while searching"
      });
    });
};

// Find a single account with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Account.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: `Account not found with id ${id}`});
      else res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || `Some error occurred while retrieving account with id ${id}`
      });
    })
};

// Update an account by the id in the request
exports.update = (req, res) => {
  Sentry.setTag("action", "account-update");
  
  Sentry.addBreadcrumb({
    category: "persistence",
    message: "updating account",
    level: Sentry.Severity.Info
  });

  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  if(req.body.points < 0) {
    Sentry.captureException("Invalid value for points. Must be greater than 0");
    res.status(500).send({
      message: "Points must be positive integer"
    });
  }

  Account.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Account with id=${id}. Maybe Account was not found!`
        });
      } else res.send({ message: "Account was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Account with id=" + id
      });
    });
};

// Delete an account with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Sentry.setTag("action", "account-deletion");
  
  Sentry.addBreadcrumb({
    category: "persistence",
    message: "deleting account",
    level: Sentry.Severity.Info
  });

  Account.findByIdAndRemove(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Account with id=${id}. Maybe Account was not found!`
        });
      } else {
        res.send({
          message: "Account was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Account with id=" + id
      });
    });
};

// Delete all accounts
exports.deleteAll = (req, res) => {
  Account.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Account were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all accounts."
      });
    });
};

// Find all premium accounts
exports.findPremium = (req, res) => {
  Account.find({ status: "Platinum" })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving accounts."
      });
    });
};
