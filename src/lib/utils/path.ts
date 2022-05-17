export const urlSplitRegex =
  /^(?:(?:(\w+):\/\/(?:(?:([^/:#?]+)(?::(\d+))?)?)?|)(\/?|)|)(?:([\s\S]*\/)?)(?:(?:(?:([\s\S]*)\.([^./#?]*))|)([^./#?]*)?|)(?:(?:#([^/?#]*))?|)(?:(?:\?([^/?]*))?)$/;

export function urlParse(urlString: string) {
  const parts = urlSplitRegex.exec(urlString).slice(1);
  const query = parts[9] ?? null;
  return {
    protocol: parts[0] || null,
    hostname: parts[1] || null,
    port: parts[2] ? parseInt(parts[2], 10) : null,
    root: parts[3] || null,
    path: parts[4] || null,
    file: parts[5] || parts[7] || null,
    extension: parts[6] || null,
    selector: parts[8] || null,
    query: query
      ? query.split('&').reduce<Record<string, string | void>>((obj, item) => {
          const [key, value] = item.split('=');
          return {
            ...obj,
            [key]: value ?? '',
          };
        }, {})
      : null,
  };
}
