
function getEnumName(val: string | undefined) {
  return val?.match(/[A-Z][a-z]+/g)?.join(' ')
};

export default getEnumName;
