export function stringifyArrayToCsvRow(array: string[]) {
  const parsedArray = array.map(element => `"${element.replaceAll(`"`, `""`)}"`);
  return parsedArray.join(',');
}
