import { parseStringPromise } from 'xml2js';

export const parseXml = async <T = unknown>(xml: string): Promise<T> => {
  const result = await parseStringPromise(xml, {
    trim: true,
    explicitArray: false,
    ignoreAttrs: false,
    mergeAttrs: true
  });
  return result as T;
};

