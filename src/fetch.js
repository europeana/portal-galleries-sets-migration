import { contentfulPreviewClient } from './config.js';

export default async() => {
  let entries = [];
  let page = 1;
  const limit = 30;
  let noMoreEntries = false;

  while (!noMoreEntries) {
    const response = await contentfulPreviewClient.getEntries({
      'content_type': 'imageGallery',
      limit,
      skip: (page - 1) * limit,
      order: 'sys.createdAt',
      locale: '*'
    });

    if (response.items.length > 0) {
      entries = entries.concat(
        response.items.map((item) => ({
          description: item.fields.description,
          identifier: item.fields.identifier['en-GB'],
          items: item.fields.hasPart['en-GB'].map((part) => part.fields.identifier['en-GB']),
          name: item.fields.name
        }))
      );
      page = page + 1;
    } else {
      noMoreEntries = true;
    }
  }

  return entries;
};
