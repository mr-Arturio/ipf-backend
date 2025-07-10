export interface SheetEntry {
  [key: string]: string | number | undefined;
  lat?: string;
  lng?: string;
  Address?: string;
}

export interface SheetDataResponse {
  data: SheetEntry[];
}
