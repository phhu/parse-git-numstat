const matchGroups = require('./match-groups');
const parseRename = require('./parse-rename');
//const parseDiff = require('parse-diff');
const parseDiff = require('c:/Users/phughson/Documents/GitHub/parse-diff')();

module.exports = function diffParser(cursor) {
  if (!cursor.hasNext() || cursor.peek().indexOf('commit ') === 0) {
    return [];
  }

  const diff = cursor
    .nextWhile(line => line.length > 0)
    .join('\n');
  

  return parseDiff(diff);
    
    //.map(line => matchGroups(/(?<added>\d+|-)\s+(?<deleted>\d+|-)\s+(?<filepath>.+)/, line))
    //.map(stat => Object.assign({}, stat, parseRename(stat.filepath)))
    //.map(parseStatLine);
};

/*
function parseStatLine(stat) {
  if (stat.added == '-' || stat.deleted == '-') {
    return Object.assign({}, stat, { added: null, deleted: null, binary: true });
  }

  return Object.assign({}, stat, {
    added: parseInt(stat.added, 10),
    deleted: parseInt(stat.deleted, 10),
  });
}
*/