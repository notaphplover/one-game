import { Location } from 'react-router-dom';

export class UrlLikeLocation {
  readonly #pathname: string;
  readonly #searchParams: URLSearchParams;

  constructor(location: Location) {
    this.#pathname = location.pathname;
    this.#searchParams = new URLSearchParams(location.search);
  }

  public get pathname(): string {
    return this.#pathname;
  }

  public get searchParams(): URLSearchParams {
    return this.#searchParams;
  }
}
