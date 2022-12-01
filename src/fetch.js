import { contentfulPreviewClient } from './config.js';
import axios from 'axios';

export default async function*() {
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
      for (const imageGallery of response.items) {
        const slug = imageGallery.fields.identifier['en-GB'];
        const itemIdentifiers = imageGallery.fields.hasPart['en-GB'].map((part) => part.fields.identifier['en-GB']);

        let foundItemIdentifiers = [];
        let requestedItemIdentifierCount = 0;
        const perPage = 100;

        while (itemIdentifiers.length > requestedItemIdentifierCount) {
          const pageOfItemIdentifiers = itemIdentifiers.slice(requestedItemIdentifierCount, perPage);
          const query = `europeana_id:("${itemIdentifiers.join('" OR "')}")`;

          const itemResponse = await axios({
            method: 'get',
            baseURL: process.env.EUROPEANA_RECORD_API_URL,
            url: '/search.json',
            params: {
              query,
              profile: 'minimal',
              rows: 100,
              wskey: process.env.EUROPEANA_API_KEY
            }
          });

          foundItemIdentifiers = foundItemIdentifiers.concat(itemResponse.data.items?.map((item) => item.id) || []);

          requestedItemIdentifierCount = requestedItemIdentifierCount + perPage;
        }

        if (foundItemIdentifiers.length === 0) {
          console.warn(`${slug}: ${foundItemIdentifiers.length}/${itemIdentifiers.length}; SKIPPING`);
        } else {
          console.info(`${slug}: ${foundItemIdentifiers.length}/${itemIdentifiers.length}; MIGRATING`);
          yield {
            description: imageGallery.fields.description,
            identifier: slug,
            datePublished: imageGallery.fields.datePublished?.['en-GB'],
            items: foundItemIdentifiers,
            name: imageGallery.fields.name
          };
        }
      }
      page = page + 1;
    } else {
      noMoreEntries = true;
    }
  }
};
