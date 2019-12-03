const matchGroups = require('./lib/match-groups');
const parseStat = require('./lib/parse-stat');
const parseDiff = require('./lib/parse-diff');
const parseTags = require('./lib/parse-tags');
const parseBranches = require('./lib/parse-branches');
const Cursor = require('./lib/cursor');

const dayjs = require('dayjs');

module.exports = function(log) {
  const commits = [];

  const lines = log.split(/\r?\n/g);
  const cursor = new Cursor(lines);

  while (cursor.hasNext() && cursor.peek().length > 0) {
    const { sha, decoration } = matchGroups(/commit\s(?<sha>[a-f0-9]*)(\s\((?<decoration>.*)\))?/i, cursor.next());

    if (!sha) {
      throw new Error(`Could not parse git log entry with no sha given at line ${cursor.index()}`);
    }

    const tags = parseTags(decoration);
    const branches = parseBranches(decoration);

    let author = cursor.next();
    let merge = null;
    let parents = [];
    
    if (author.indexOf('Merge') >= 0) {
      merge = author;
      author = cursor.next();
    } else if (author.indexOf('Parents:') >= 0) {
      parents = author.replace(/Parents: ?/,'').trim().split(' ');
      author = cursor.next();
    }
    
    if (!author) {
      throw new Error(`Could not parse git log entry with no author given at line ${cursor.index()}`);
    }

    const dateRaw = matchGroups(/Date:\s+\w+\s(?<date>.*)/, cursor.next()).date;
    const date = dayjs(dateRaw, 'MMM D HH:mm:ss YYYY ZZ').toDate();

    // skip newline
    cursor.next();

    const message = cursor
      .nextWhile(line => line.length > 0)
      .map(line => line.trim())
      .reduce((accumulator, current, idx) => (idx === 0 ? current : accumulator + '\n' + current), '');

    const stat = parseStat(cursor);
    const diff = parseDiff(cursor);

    const commit = {
      sha,
      author: parseAuthor(author),
      merge,
      parents,
      date,
      message,
      stat,
      diff,
    };

    if (tags) {
      commit.tags = tags;
    }

    if (branches) {
      commit.branches = branches;
    }

    commits.push(commit);
  }

  return commits;
};

function parseAuthor(author) {
  return matchGroups(/Author:\s(?<name>.*?)\s<(?<email>.*?)>/, author);
}
