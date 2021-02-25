const withProtocol = new RegExp(
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/
);

const withoutProtocol = new RegExp(
  /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/
);

export function validateAndFormat(url: string): string {
  url = url.trim();

  if (url.match(withProtocol)) {
    return url;
  }

  if (url.match(withoutProtocol)) {
    return `http://${url}`;
  }

  throw new Error('잘못된 url 형식입니다.');
}
