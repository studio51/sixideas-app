export class Image {
  constructor(fields: any) {
    for (const f in fields) {
      // @ts-ignore
      this[f] = fields[f];
    }
  }
}

export interface Image {
  [prop: string]: any;
}
