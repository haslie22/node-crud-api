interface UrlInfo {
  route: string;
  idParam?: string;
}

const parseUrl = (url: string): UrlInfo => {
  if (url === '/') {
    return { route: url };
  }

  const parts = url.split('/');
  if (parts.length < 2) {
    throw new Error('Invalid URL');
  }

  return {
    route: `/${parts[1]}/${parts[2]}`,
    idParam: parts[3],
  };
};

export default parseUrl;
