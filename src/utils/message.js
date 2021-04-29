export const messages = {
  welcome: 'welcome on board',
  created: 'resource successfully created',
  success: 'request was successful',
  notFound: 'resource not available',
  badRequest: 'something bad happened',
  unAuthorized: 'username or password incorrect',
  deleted: 'resource successfully deleted',
  uploadError: 'no files attached',
  amountError: (slug) => `Looks like the amount of ${slug} has been tampered with`,
  quantityOverLoad: (slug) => `you have selected more than we have in stock for ${slug}`,
  invalidRating: 'invalid rating value',
  ratingMisnomer: 'rating must be between 1- 5',
  reactionRemoved: 'reaction removed'
};