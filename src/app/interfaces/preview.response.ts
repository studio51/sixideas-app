interface ErrorStatusInterface {
  '400': 'Generic error',
  '401': 'Cannot verify API access key',
  '403': 'Invalid or blank API access key',
  '423': 'Forbidden by robots.txt',
  '424': 'Invalid response status code',
  '429': 'Too many requests / rate limit exceeded'
}

export interface PreviewResponse {
  title: string,
  description: string,
  image: string,
  url: string,
  error?: ErrorStatusInterface
}