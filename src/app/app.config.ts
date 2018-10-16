enum endpoints {
  production  = 'https://1801-six-ideas.mdw.re',
  development = 'http://lvh.me:3000'
}

const environment: string = 'development'; 

export const webURL: string = `${ endpoints[environment] }`;
export const url: string = `${ webURL }/api/v1/`;