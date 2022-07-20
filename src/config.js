import 'dotenv/config';

import contentful from 'contentful';

export const contentfulPreviewClient = contentful.createClient({
  accessToken: process.env['CTF_CPA_ACCESS_TOKEN'],
  environment: process.env['CTF_ENVIRONMENT_ID'],
  host: 'preview.contentful.com',
  space: process.env['CTF_SPACE_ID']
});
