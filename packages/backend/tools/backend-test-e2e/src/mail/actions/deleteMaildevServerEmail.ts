import * as axios from 'axios';

export async function deleteMaildevServerEmail(id: string): Promise<void> {
  await axios.default.request({
    method: 'DELETE',
    url: `http://localhost:1080/email/${id}`,
  });
}
