import { encode } from '@datadog/pprof';
import axios, { AxiosError } from 'axios';
import FormData from 'form-data';
import { Profile } from 'pprof-format';

import { ProfileExporter } from '../../datadog-pprof/modules/ProfileExporter';
import { processProfile } from '../../datadog-pprof/utils/processProfile';
import { PyroscopeConfig } from '../models/PyroscopeConfig';

const MICROSECONDS_PER_SECOND: number = 1e6;

export class PyroscopeApiExporter implements ProfileExporter {
  readonly #sampleTypeConfig: string | undefined;
  readonly #config: PyroscopeConfig;

  constructor(config: PyroscopeConfig, sampleTypeConfig?: string) {
    this.#config = config;

    this.#sampleTypeConfig = sampleTypeConfig;
  }

  public async export(profile: Profile): Promise<void> {
    await this.#uploadProfile(this.#config, profile, this.#sampleTypeConfig);
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

  async #uploadProfile(
    config: PyroscopeConfig,
    profile: Profile,
    sampleTypeConfig?: string,
  ): Promise<void> {
    const newProfile: Profile = processProfile(profile);

    const buf: Buffer = await encode(newProfile);

    const formData: FormData = new FormData();
    formData.append('profile', buf, {
      contentType: 'text/json',
      filename: 'profile',
      knownLength: buf.byteLength,
    });

    if (sampleTypeConfig !== undefined) {
      formData.append('sample_type_config', sampleTypeConfig, {
        filename: 'sample_type_config.json',
        knownLength: sampleTypeConfig.length,
      });
    }

    const rate: number =
      MICROSECONDS_PER_SECOND / Number(config.samplingIntervalMicros);

    const url: string = `${
      config.serverAddress
    }/ingest?name=${encodeURIComponent(
      config.applicationName,
    )}&sampleRate=${rate}&spyName=nodespy`;

    // send data to the server
    try {
      await axios(url, {
        data: formData,
        headers:
          config.authToken === undefined
            ? formData.getHeaders()
            : {
                ...formData.getHeaders(),
                authorization: `Bearer ${config.authToken}`,
              },
        method: 'POST',
      });
    } catch (error: unknown) {
      this.#handleAxiosError(error as AxiosError);
    }
  }
}
