const includesOnlyDigits = (str: string) => /^\d+$/.test(str);

export const digitOnlyQueryStringToNumberArray = (qs: string): number[] => {
  // '9,2,6' => ['9', '2', '6']
  const arr = qs.trim().split(',');

  // check if every item in array has only digits
  const isValid = arr.every((item) => includesOnlyDigits(item));

  // throw if non numeric character included
  if (!isValid) {
    throw new Error();
  }

  // ['9', '2', '6'] => [9, 2, 6]
  return arr.map((item) => parseInt(item));
};
