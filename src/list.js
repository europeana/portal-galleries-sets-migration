import { contentfulPreviewClient } from './config.js';

const list = async() => {
  const response = await contentfulPreviewClient.getEntries({
    'content_type': 'imageGallery',
    limit: 1,
    order: 'sys.createdAt'
  });

  const entries = response.items.map((item) => ({
    description: item.fields.description,
    identifier: item.fields.identifier,
    items: item.fields.hasPart.map((part) => part.fields.identifier),
    name: item.fields.name
  }));

  return entries;
};

const cli = async() => {
  const galleries = await list();
  console.log(JSON.stringify(galleries, null, 2));
};

export default {
  cli
};
