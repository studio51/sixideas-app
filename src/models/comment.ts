export class Comment {
  constructor(fields: any) {
    for (const f in fields) {
      // @ts-ignore
      this[f] = fields[f];
    }
  }
}

export interface Comment {
  [prop: string]: any;
}
