export let environment = 'development';

let production  = 'https://';
// let development = 'http://lvh.me:3000';
let development = 'http://192.168.0.10:3000';

export let endpoint = `${ development }/api/v1/`;

export let sentry_dns = '';
export let release = '1.0.0.beta1';