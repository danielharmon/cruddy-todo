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
      console.log('read dir error', err)
      callback(new Error('Error reading directory'), null);
    } else {
      let array = [];
      if (files.length === 0) {
        callback(null, array)
      } else {
      files.forEach((file, i) => {
        fs.readFile(`${exports.dataDir}/${file}`, (err, data) => {
          if(err) {
            console.log(`at file ${file}`, err)
            callback(err, null);
          }
          const id = file.split('.')[0];
          array.push({
            id,
            text: data.toString()
          });
          if (array.length === files.length) {
            callback(null, array);
          }
        
        });
      });
    }
  }
  });
};

exports.readOne = (id, callback) => {
  fs.readFile(`${exports.dataDir}/${id}.txt`, (err, results) => {
    if (err) callback(new Error('error on read one'));
    else {
      const file = {
        id,
        text: results.toString()
      }
      callback(null, file);    
    }
  })
};

exports.update = (id, text, callback) => {
  fs.readFile(`${exports.dataDir}/${id}.txt`,  (err, data) => {
    if (err) {
      callback(new Error(`Couldnt read file with id: ${id}`))
    } else {
      fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
        if (err) {
          callback(new Error(`Couldn't update file`))
        } else {
          callback(null, {id, text})
        }
      })
    }
  })
};


exports.delete = (id, callback) => {
  fs.unlink(`${exports.dataDir}/${id}.txt`, (err) => {
    if (err) { callback(new Error(`Error deleting file`))}
    else { callback(null, `File with ${id} deleted`)}
  })
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
