import axios from 'axios';
import url from 'url';

export default async() => {
  const tokenResponse = await axios({
    method: 'post',
    url: process.env.OPENID_TOKEN_ENDPOINT,
    data: (new url.URLSearchParams({
      'client_id': process.env.OPENID_CLIENT_ID,
      'client_secret': process.env.OPENID_CLIENT_SECRET,
      username: process.env.OPENID_USERNAME,
      password: process.env.OPENID_PASSWORD,
      'grant_type': 'password',
      scope: 'openid usersets'
    })).toString()
  });

  return tokenResponse.data;
};
