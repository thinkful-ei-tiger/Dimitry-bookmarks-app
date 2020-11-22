
import {renderBookmarks, addErrorToDom} from './index.js';

import { updateStore, store} from './store.js';

//getBookmarks function to get data from API. 
function getBookmarks() {
  fetch('https://thinkful-list-api.herokuapp.com/dimitry/bookmarks')
    .then(response => response.json())
    .then(responseJsonObj => {
      for (let bookmark of responseJsonObj) bookmark.expanded = false;
      updateStore(responseJsonObj);
      renderBookmarks();
    })
  //    .then(responseJson => console.log(responseJson))
    .catch(error => console.log(error));
}
  


//addBookmark function which will post to the API so that we can the bookmark.
function addBookmark(title, url, desc = '', rating = 0) {
  if (title === '' || url ==='') {
    store.error = 'You done goofed! Please enter a Title and a URL.';
    addErrorToDom(); 
  
  } else {
    var newBookmark = { 'title': title, 'url': url };
    if (rating >= 1 && rating <= 5) {
      newBookmark['rating'] = rating;
    }
    if (desc) {
      newBookmark['desc'] = desc;
    }
    return fetch('https://thinkful-list-api.herokuapp.com/dimitry/bookmarks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBookmark)
    });
  }
}

export {getBookmarks, addBookmark};