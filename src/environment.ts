const url = {
  local: 'http://localhost:5000/api/v1',
  dev: 'http://dev.example.com',
  viacep: 'https://viacep.com.br/ws/'
}
export const environment = {
  baseUrl: url.local,
  viacep: url.viacep
}
