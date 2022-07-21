import axios from 'axios';
import auth from './auth.js';

let accessToken;

export default async(uri, action = 'publish') => {
  if (!accessToken) {
    const authTokenResponse = await auth();
    accessToken = authTokenResponse['access_token'];
  }

  console.log(`${action} ${uri}`);

  const url = `/${uri.replace('http://data.europeana.eu/set/', '')}/${action}`;
  const publishResponse = await axios({
    method: 'put',
    baseURL: process.env.EUROPEANA_SET_API_URL,
    url,
    headers: {
      'Authorization': `Bearer ${accessToken}`
    },
    params: {
      wskey: process.env.EUROPEANA_SET_API_KEY
    }
  });

  return publishResponse.data;
};
