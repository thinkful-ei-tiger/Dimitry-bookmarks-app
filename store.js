const store = {
  bookmarks: [

  ],
  adding: false,
  error: null,
  filter: 0
};

function updateStore(bookmarks) {
  store.bookmarks = bookmarks;
}

function addToStore(bookmarks) {
  store.bookmarks = store.bookmarks.concat(bookmarks);
}
function getStoreBookmarks() {
  return store.bookmarks;
}

export {updateStore, getStoreBookmarks, addToStore, store}; 