import type { SheetEntry } from "./types";

export function transformDataToObjects<T extends SheetEntry = SheetEntry>(
  data: string[][]
): T[] {
  if (!Array.isArray(data) || data.length === 0) return [];

  const headers = data[0];

  return data.slice(1).map((row) => {
    const obj: SheetEntry = {}; // Use the defined type here
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj as T;
  });
}