export type Order = 'asc' | 'desc';

export const getRandomNumber = (min: number, max: number): number => {
  const processedMin = Math.ceil(min);
  const processedMax = Math.floor(max);
  return (
    Math.floor(Math.random() * (processedMax - processedMin + 1)) + processedMin
  );
};

export const getLocalizedDate = (date: Date): string =>
  `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;

function descendingComparator<T>(a: T, b: T, orderBy: keyof T): number {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export function getComparator<T>(
  order: Order,
  orderBy: keyof T,
): (a: T, b: T) => number {
  return order === 'desc'
    ? (a, b): number => descendingComparator(a, b, orderBy)
    : (a, b): number => -descendingComparator(a, b, orderBy);
}

export function stableSort<T>(
  array: Array<T>,
  comparator: (a: T, b: T) => number,
): Array<T> {
  const objects = array.map((obj, index) => [obj, index] as [T, number]);
  objects.sort((objA, objB) => {
    const order = comparator(objA[0], objB[0]);
    if (order !== 0) return order;
    return objA[1] - objB[1];
  });
  return objects.map((el) => el[0]);
}
