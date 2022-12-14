import axios from 'axios';
import auth from './auth.js';

let accessToken;

const setLangMap = (contentfulLangMap) => {
  const langMap = {};

  for (const key in contentfulLangMap) {
    langMap[key.split('-')[0]] = contentfulLangMap[key];
  }

  return langMap;
};

const setVisibility = (data) => {
  if (data.revision === 0) {
    return 'private';
  } else if (data.datePublished && (new Date(data.datePublished) <= new Date())) {
    return 'public';
  } else {
    return 'private';
  }
};

const setData = (data) => ({
  type: 'Collection',
  visibility: setVisibility(data),
  title: setLangMap(data.name),
  description: setLangMap(data.description),
  items: data.items.map((id) => `http://data.europeana.eu/item${id}`)
});

export default async(data) => {
  if (!accessToken) {
    const authTokenResponse = await auth();
    accessToken = authTokenResponse['access_token'];
  }

  const createResponse = await axios({
    method: 'post',
    baseURL: process.env.EUROPEANA_SET_API_URL,
    url: '/',
    data: setData(data),
    headers: {
      'Authorization': `Bearer ${accessToken}`
    },
    params: {
      wskey: process.env.EUROPEANA_API_KEY
    }
  });

  console.log(`create ${createResponse.data.id} [${createResponse.data.visibility}]`);

  return createResponse.data;
};
