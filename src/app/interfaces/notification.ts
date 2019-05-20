export class Notification {
  constructor(fields: any) {
    for (const f in fields) {
      // @ts-ignore
      this[f] = fields[f];
    }
  }
}

export interface Notification {
  [prop: string]: any;
}
