// Consider https://www.rfc-editor.org/rfc/rfc3986#section-3.3 as reference
const URI_PATH_SEPARATOR: string = '/';
const URI_CURRENT_DOT_SEGMENT: string = '..';
const URI_PARENT_DOT_SEGMENT: string = '..';

export function relativeUrl(from: string, to: string): string {
  const normalizedFromUrl: URL = new URL(from);
  const normalizedToUrl: URL = new URL(to);

  if (relativeUrlExists(normalizedFromUrl, normalizedToUrl)) {
    const relativePath: string = buildRelativePath(
      normalizedFromUrl.pathname,
      normalizedToUrl.pathname,
    );

    return `${relativePath}${normalizedToUrl.search}${normalizedToUrl.hash}`;
  } else {
    throw new Error(
      'Source and destination URL differ in such a way there is no relative path between them.',
    );
  }
}

function relativeUrlExists(from: URL, to: URL): boolean {
  return from.protocol === to.protocol && from.host === to.host;
}

function splitPathParts(urlPath: string): string[] {
  return urlPath.split(URI_PATH_SEPARATOR);
}

function buildRelativePath(fromPath: string, toPath: string): string {
  const fromPathParts: string[] = splitPathParts(fromPath);
  const toPathParts: string[] = splitPathParts(toPath);

  return buildRelativePathFromPartsAndCommonPartsCount(
    fromPathParts,
    toPathParts,
  );
}

function buildRelativePathFromPartsAndCommonPartsCount(
  fromPathParts: string[],
  toPathParts: string[],
): string {
  // This algorithm is built considering https://www.rfc-editor.org/rfc/rfc3986#section-5.2

  const commonPartsLength: number = countCommonPathParts(
    fromPathParts,
    toPathParts,
  );

  const relativePathParts: string[] = [];

  const parentDotSegmentsAmount: number =
    fromPathParts.length - commonPartsLength - 1;

  for (let i: number = 0; i < parentDotSegmentsAmount; ++i) {
    relativePathParts.push(URI_PARENT_DOT_SEGMENT);
  }

  relativePathParts.push(URI_CURRENT_DOT_SEGMENT);

  relativePathParts.push(...toPathParts.slice(commonPartsLength));

  return relativePathParts.join(URI_PATH_SEPARATOR);
}

function countCommonPathParts(
  fromPathParts: string[],
  toPathParts: string[],
): number {
  const maximunCommonPathParts: number = Math.max(
    0,
    Math.min(fromPathParts.length, toPathParts.length) - 1,
  );

  let commonPartsLength: number = 0;

  for (let i: number = 0; i < maximunCommonPathParts; ++i) {
    const ithFromPathPart: string = fromPathParts[i] as string;
    const ithToPathPart: string = toPathParts[i] as string;

    if (ithFromPathPart === ithToPathPart) {
      ++commonPartsLength;
    }
  }

  return commonPartsLength;
}
