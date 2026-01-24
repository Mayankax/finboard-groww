export function getValueByPath(obj: any, path: string) {
  return path.split(".").reduce((acc, key) => {
    if (acc && key in acc) {
      return acc[key];
    }
    return undefined;
  }, obj);
}
