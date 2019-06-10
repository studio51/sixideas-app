
export enum Color {
  primary   = 'primary',
  secondary = 'secondary',
  tertiary  = 'tertiary',
  success   = 'success',
  warning   = 'warning',
  danger    = 'danger',
  dark      = 'dark',
  medium    = 'medium',
  light     = 'light'
}

export class Post {
  constructor(fields?: any) {
    for (const f in fields) {
      // @ts-ignore
      this[f] = fields[f];
    }

    // @ts-ignore
    this['type'] = Color.light;
  }
}

export interface Post {
  [prop: string]: any;
}
