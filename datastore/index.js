const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    if (err) {
      callback(null, null);
    } else {
    fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err)=> {
      if (err) {
        callback(null, 0);
      } else {
        callback(null, {
          id: id,
          text: text
        })
      }
    })
    }
  })
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      callback(new Error('Error reading directory'), null);
    } else {
      let array = [];
      if (files.length === 0) {
        callback(null, array)
      }
      files.forEach((file, i) => {
        // console.logfile)
        fs.readFile(`${exports.dataDir}/${file}`, (err, data) => {
          if(err) callback(err, null);
          const id = file.split('.')[0];
          array.push({
            id,
            text: data.toString()
          });
          if (i === files.length - 1) {
            callback(null, array);
          }
        });
      });
    }
  });
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
