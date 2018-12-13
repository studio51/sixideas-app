enum endpoints {
  production  = 'https://1801-six-ideas.mdw.re',
  development = 'http://192.168.1.9:3000'
}

const environment: string = 'development'; 

export const webURL: string = `${ endpoints[environment] }`;
export const url: string = `${ webURL }/api/v1/`;