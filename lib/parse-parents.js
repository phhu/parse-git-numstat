const ignorePrefixes = ['tag: ', 'HEAD -> '];

module.exports = function parseParents(decoration) {
  if (!decoration) {
    return;
  }

  const branches = decoration
    .split(',')
    .map(d => d.trim())
    .filter(d => d && !ignorePrefixes.some(ignore => d.startsWith(ignore)));

  return branches;
};
