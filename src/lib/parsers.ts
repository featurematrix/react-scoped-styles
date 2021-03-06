export const findClosingParenthesisIdx = (str: string) => {
  let stack = null;

  for (let i = 0; i < str.length; i++) {
    const char = str[i];

    if (char === '(') {
      if (stack === null) stack = 0;
      stack += 1;
    } else if (char === ')') {
      if (stack !== null) stack -= 1;
    }
    if (stack === 0) return i;
  }

  return 0;
};

// const dynKeyRegex = /(?<=\[).+(?=\]\:)/g;
// const constKeyRegex = /['"`]?([\w-${}]+)["'`]?(?=:)/g;
// const defaultClassRegex = /["'`](.+)["'`](?=[,)])/g;
const allStringsRegex = /["'`](.+?)["'`]/g;

export const replaceConditionals = (content: string, includeHash: (className: string) => string) => {
  if (!/classes\(/ig.test(content)) {
    return content;
  }

  const regexp = /classes\(/ig;

  let match;
  let replacedContent = content;

  while((match = regexp.exec(content)) !== null) {
    const startIdx = match.index;
    const closingIdx = findClosingParenthesisIdx(content.slice(startIdx)) + startIdx + 1;
    const pre = content.slice(0, startIdx);
    const post = content.slice(closingIdx);

    const classesExpr = content
      .slice(startIdx, closingIdx)
      .replace(allStringsRegex, (_, className) => `'${includeHash(className)}'`)

    replacedContent = pre + classesExpr + post;
  }

  return replacedContent;
};