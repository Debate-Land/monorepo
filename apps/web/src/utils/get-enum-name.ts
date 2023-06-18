
function getEnumName(val: string) {
  return val.match(/[A-Z][a-z]+/g)?.join(' ')
};

export default getEnumName;
