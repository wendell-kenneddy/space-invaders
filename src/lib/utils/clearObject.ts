export function clearRecord(object: Record<string, any>) {
  for (const prop in object) {
    delete object[prop];
  }
}
