import axios from 'axios';

import { MaildevMail } from '../types/MaildevMail';

export async function getMaildevServerMails(): Promise<MaildevMail[]> {
  const axiosResponse: axios.AxiosResponse<MaildevMail[]> = await axios.request(
    {
      method: 'GET',
      url: `http://localhost:1080/email`,
    },
  );

  return axiosResponse.data;
}
