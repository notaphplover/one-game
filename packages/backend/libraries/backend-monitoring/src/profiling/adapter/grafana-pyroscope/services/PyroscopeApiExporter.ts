import { URL } from 'node:url';

import { encode } from '@datadog/pprof';
import axios, { AxiosError } from 'axios';
import FormData, { Headers } from 'form-data';
import { Profile } from 'pprof-format';

import { dateToUnixTimestamp } from '../../../../date/utils/dateToUnixTimestamp';
import {
  ProfileExport,
  ProfileExporter,
} from '../../datadog-pprof/modules/ProfileExporter';
import { processProfile } from '../../datadog-pprof/utils/processProfile';

export class PyroscopeApiExporter implements ProfileExporter {
  readonly #applicationName: string;
  readonly #authToken: string | undefined;
  readonly #serverAddress: string;

  constructor(
    applicationName: string,
    authToken: string | undefined,
    serverAddress: string,
  ) {
    this.#applicationName = applicationName;
    this.#authToken = authToken;
    this.#serverAddress = serverAddress;
  }

  public async export(profileExport: ProfileExport): Promise<void> {
    await this.#uploadProfile(profileExport);
  }

  #buildEndpointUrl(profileExport: ProfileExport): URL {
    const endpointUrl: URL = new URL(`${this.#serverAddress}/ingest`);

    endpointUrl.searchParams.append(
      'from',
      dateToUnixTimestamp(profileExport.startedAt).toString(),
    );
    endpointUrl.searchParams.append('name', this.#applicationName);
    endpointUrl.searchParams.append('spyName', 'nodespy');
    endpointUrl.searchParams.append(
      'until',
      dateToUnixTimestamp(profileExport.stoppedAt).toString(),
    );

    if (profileExport.sampleRate !== undefined) {
      endpointUrl.searchParams.append(
        'sampleRate',
        profileExport.sampleRate.toString(),
      );
    }

    return endpointUrl;
  }

  #buildRequestHeaders(formData: FormData): Headers {
    const headers: Headers = formData.getHeaders();

    if (this.#authToken !== undefined) {
      headers['authorization'] = `Bearer ${this.#authToken}`;
    }

    return headers;
  }

  async #buildUploadProfileFormData(profile: Profile): Promise<FormData> {
    const processedProfile: Profile = processProfile(profile);

    const profileBuffer: Buffer = await encode(processedProfile);

    const formData: FormData = new FormData();

    formData.append('profile', profileBuffer, {
      contentType: 'text/json',
      filename: 'profile',
      knownLength: profileBuffer.byteLength,
    });

    return formData;
  }

  #handleAxiosError(error: AxiosError): void {
    if (error.response !== undefined) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Pyroscope received error while ingesting data to server');
      console.error(error.response.data);
    } else if (error.request !== undefined) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.error('Error when ingesting data to server:', error.message);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error', error.message);
    }
  }

  async #uploadProfile(profileExport: ProfileExport): Promise<void> {
    const formData: FormData = await this.#buildUploadProfileFormData(
      profileExport.profile,
    );

    try {
      await axios(this.#buildEndpointUrl(profileExport).toString(), {
        data: formData,
        headers: this.#buildRequestHeaders(formData),
        method: 'POST',
      });
    } catch (error: unknown) {
      this.#handleAxiosError(error as AxiosError);
    }
  }
}
