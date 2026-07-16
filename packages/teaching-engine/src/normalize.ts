export function normalizeText(value: string): string {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .toLocaleLowerCase("tr-TR");
}

export function sameTokenSet(left: string[], right: string[]): boolean {
  if (left.length !== right.length) {
    return false;
  }

  const sortedLeft = [...left].sort();
  const sortedRight = [...right].sort();

  return sortedLeft.every((tokenId, index) => tokenId === sortedRight[index]);
}
