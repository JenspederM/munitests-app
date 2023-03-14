import { TestType } from "./types";

export const isInString = (_string: string, searchString: string) => {
  if (typeof _string !== "string") {
    _string = `${_string}`;
  }

  if (typeof searchString !== "string") {
    searchString = `${searchString}`;
  }

  try {
    const filterCategory = searchString.toLowerCase();
    const containsCategory = _string.toLowerCase().search(filterCategory);
    return containsCategory !== -1;
  } catch (error) {
    return _string.includes(searchString);
  }
};
export const filterTests = (
  tests: TestType[],
  category?: string,
  question?: string,
  intent?: string
) => {
  return tests
    .filter((test) => {
      if (!category) {
        return true;
      }
      return isInString(test.category, category);
    })
    .filter((test) => {
      if (!question) {
        return true;
      }
      return isInString(test.question, question);
    })
    .filter((test) => {
      if (!intent) {
        return true;
      }
      return isInString(test.intent, intent);
    });
};
