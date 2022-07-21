import axios from 'axios';
import auth from './auth.js';

let accessToken;

export default async(uri) => {
  if (!accessToken) {
    const authTokenResponse = await auth();
    accessToken = authTokenResponse['access_token'];
  }

  console.log(`delete ${uri}`);

  const url = `/${uri.replace('http://data.europeana.eu/set/', '')}`;
  const deleteResponse = await axios({
    method: 'delete',
    baseURL: process.env.EUROPEANA_SET_API_URL,
    url,
    headers: {
      'Authorization': `Bearer ${accessToken}`
    },
    params: {
      wskey: process.env.EUROPEANA_SET_API_KEY
    }
  });

  return deleteResponse.data;
};
