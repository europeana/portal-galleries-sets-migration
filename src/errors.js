export const setNotFoundError = (error) => (
  (error.response?.status === 404) && (error.response?.data?.error.startsWith('No user set found in database for identifier'))
);

export const unpublishNotPublishedSetError = (error) => (
  (error.response?.status === 400) && (error.response?.data?.error.startsWith('Unpublish operation not allowed for not published sets'))
);
