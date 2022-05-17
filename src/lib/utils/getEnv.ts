export function getIsServer() {
  return import.meta.env.SSR;
}

export function getIsProduction() {
  return import.meta.env.PROD;
}
