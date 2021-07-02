export const removeMask = value => value.replace(/[^\d]/gi, '');

export const parseJWT = token => JSON.parse(Buffer.from(token.split('.')[1], 'base64'));

export const isValidCPF = value => {
  const calcChecker = (cpf, digit) => {
    let sum = null;
    for (let i = 0; i < digit - 1; ++i) {
      sum += Number(cpf.toString().charAt(i)) * (digit - i);
    }
    const checker = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    return checker;
  };

  const cleanCPF = String(value).replace(/\.|-|\s/g, '');
  const firstNineDigits = cleanCPF.substring(0, 9);
  const checker = cleanCPF.substring(9, 11);

  if (cleanCPF.length !== 11) {
    return false;
  }

  // Checking if all digits are equal
  for (let i = 0; i < 10; i++) {
    if (`${firstNineDigits}${checker}` === Array(12).join(String(i))) {
      return false;
    }
  }
  const checker1 = calcChecker(firstNineDigits, 10);
  const checker2 = calcChecker(`${firstNineDigits}${checker1}`, 11);

  return checker.toString() === checker1.toString() + checker2.toString();
};
