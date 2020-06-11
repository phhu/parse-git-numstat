module.exports = function matchGroups(regex, text) {
  let match;
  try{
    match =  text.match(regex);
  } catch(e){
    // ignore
  }

  if (!match) {
    return false;
  }

  if (!match.groups) {
    return false;
  }

  return match.groups;
};
