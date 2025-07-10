export function transformDataToObjects<T extends { [key: string]: any }>(data: string[][]): T[] {
  if (!Array.isArray(data) || data.length === 0) return [];

  const headers = data[0];

  return data.slice(1).map((row) => {
    const obj: { [key: string]: any } = {}; // intermediate object
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj as T;
  });
}