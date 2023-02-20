// match any amount of whitespace, and a comma followed by any amount of whitespace
const categoryStringDelimiters = new RegExp(/\s*\,\s*/g);

export default function getCategoriesFromString(categories: string): string[] {
  if (!categories || !categories.length) {
    return [];
  }

  return categories
    .toLowerCase()
    .split(categoryStringDelimiters)
    .filter(category => category);
}
