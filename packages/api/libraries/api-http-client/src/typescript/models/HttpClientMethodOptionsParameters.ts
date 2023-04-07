import { HttpClientMethodOptionsParameter } from './HttpClientMethodOptionsParameter';

export interface HttpClientMethodOptionsParameters {
  headers: HttpClientMethodOptionsParameter[];
  query: HttpClientMethodOptionsParameter[];
  url: HttpClientMethodOptionsParameter[];
}
