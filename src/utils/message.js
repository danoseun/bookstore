export const messages = {
  welcome: 'welcome on board',
  created: 'resource successfully created',
  success: 'request was successful',
  notFound: 'resource not available',
  badRequest: 'something bad happened',
  todoDoesNotExist: 'the todo you are looking for does not exist',
  deleted: 'resource successfully deleted',
  uploadError: 'no files attached',
  amountError: (slug) => `Looks like the amount of ${slug} has been tampered with`,
  quantityOverLoad: (slug) => `you have selected more than we have in stock for ${slug}`
};