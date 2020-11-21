const $ = require('jquery');

/*import 'normalize.css';*/

import './styles.css';

import { updateStore, getStoreBookmarks, addToStore, store} from './store.js';

//renderBookmark function 
function renderBookmark(bookmark) {
  var newBookmark = '';
  newBookmark += `<div data-item-id="${bookmark.id}" class='bookmark' >`;
  newBookmark += `  <p>${bookmark.title}</p>`;
  newBookmark += '  <div class="rating">';
  if (bookmark.rating !== 0) {
    for (var i = 1; i <= 5; i++) {
      if (i <= bookmark.rating) {
        newBookmark += ' <span class="fa fa-star checked"></span>';
      } else {
        newBookmark += ' <span class="fa fa-star"></span>';
      }
    }
  }
  newBookmark += '  </div>';
  if (bookmark.expanded) {
    newBookmark += `  <a href='${bookmark.url}' target='_blank' class="url">Visit Website</a>`;
    newBookmark += `  <div class="desc">${bookmark.desc}</div>`;
    //Delete button
    newBookmark += '<button type="button" id="delete-bookmark-button">Delete</button>'
  }
  //Cancel button HERE
  newBookmark += `<div id="${bookmark.id}" >`;
  $('div.bookmarks').append(newBookmark);

}

function renderBookmarks() {
  let storeBookmarks = getStoreBookmarks();
  storeBookmarks = storeBookmarks.filter((bookmark) => bookmark.rating >= store.filter);
  console.log(storeBookmarks);
  $('div.bookmarks').html('');
  for (let i = 0; i < storeBookmarks.length; i++) {
    const bookmark = storeBookmarks[i];
    renderBookmark(bookmark);
  };
}

/*renderBookmark('abcd', 'Pizza Hut', 'http://pizzahut.com', 'not bad pizza... eat some.', 3);
renderBookmark('abcde', 'Papa Johns', 'http://papajohns.com');*/

//???addBookmark function which will post to the API so that we can the bookmark. ???
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

/*renderBookmark(fbk.id, fbk.title, fbk.url, fbk.desc, fbk.rating);*/

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

//get itemId function to expand the view.
function getItemIdFromElement(item) {
  return $(item)
    .data('item-id');
}

//function to handle expanded view of the bookmarks
function handleExpandedView() {
  $('.bookmarks').on('click', '.bookmark', function(event) {
    const id = getItemIdFromElement(event.currentTarget);
    console.log(id);
    //find bookmark in store with the id 
    const item = store.bookmarks.find(item => item.id === id);
    console.log(item);
    //change expanded to true
    item.expanded = !item.expanded;
    //rerender
    renderBookmarks();
  });
} 

///function that handles NewBookmark button////
function handleNewBookmarkButton() {
  $('#new-button').on('click', function () {
    renderAddForm();
  });

}

//function that handles filterByRating button
function handleFilterByRating() {
  console.log('hi');
  $('#js-rating-dropdown').on('change', function() {
    let userSelect = $(this).val();
    store.filter = Number(userSelect);
    renderBookmarks();
  });
}

//renderFilterOptions function to create options list
//Attach event listener for each one so that when clicked it filters the bookmarks

//renderAddFrom function to create HTML inside of index.html page
function renderAddForm() {
  var myBookmarks = '';
  myBookmarks = `<form id='bookmark-form'>
  <h3>Create Bookmark<h3>
  <div id='error'></div>
  
  <div class='item1'>
    <label for="title"></label>
    <input id="title" type="text" name="title"
    placeholder="Enter Title">
  </div>

  <div class='item1'>
    <input id="url" type="url" name="url"
    placeholder="Enter url using https://"> 
  </div>

  <div class='item1'>
    <label for="form-message"></label>
    <textarea id="form-message" name="message"
    placeholder="Enter Description"></textarea>
  </div>
  
  <div class='item1'>
    <label for ='rating'> Rating</label>
    <select name='rating' id='rating-dropdown' required>
    <option value=''>None</option>
    <option value='1'>1</option>
    <option value='2'>2</option>
    <option value='3'>3</option>
    <option value='4'>4</option>
    <option value='5'>5</option>
    </select>
  </div>

  <button name='submit' class='js-submit-button'>Submit</button>
  <button name='cancel' class='js-cancel-button' id='cancel-button'>Cancel</button>
</form>`;
  $('div.bookmarks').html(myBookmarks);

}

function addErrorToDom() {
  var errorCheck = `<p>${store.error}</p>`;
  $('#error').empty();
  $('#error').append(errorCheck);
}

function handleCancelButton() {
  $('.bookmarks').on('click', '#cancel-button', function() {
    renderBookmarks();
  });
}

//handleSubmitForm function
function handleSubmitForm() {
  console.log('handle sumbit form called');
  $('.bookmarks').on('submit', '#bookmark-form', function (event) {
    event.preventDefault();
    console.log('form submitted');
    //value of title input and url and description
    const newTitle = $('#title').val();
    $('#title').val('');
    console.log(newTitle);
    const newURL = $('#url').val();
    $('#url').val('');
    console.log(newURL);
    const newDesc = $('#form-message').val();
    $('#form-message').val('');
    console.log(newDesc);
    const newRating = parseInt($('#rating-dropdown').val());
    console.log(newRating);
    addBookmark(newTitle, newURL, newDesc, newRating)
      .then(response => response.json())
      .then(responseJsonObj => {
        addToStore(responseJsonObj);
        $('#bookmark-form').remove();
        //store.error = null;
        renderBookmarks();
      })
      .catch(error => {
        console.log(error);
        //store.error = error;
        //renderAddForm();
      });
     
  });
}

//function to make delete call to API and once delete call is finished we update the local store. 
function handleDeleteBookmark() {
  $('.bookmarks').on('click', '#delete-bookmark-button', (event) => {
    const currentId = $(event.target).parent().attr('data-item-id');
    fetch(`https://thinkful-list-api.herokuapp.com/dimitry/bookmarks/${currentId}`, {
      method: 'DELETE',
    })
      .then(()=> {
        getBookmarks();
      });
  });
}


//PageLoad function



//collapseBookmark function

//AddBookmarkPage function

//formErrorPage function
function handleBookmarkApp() {
  handleNewBookmarkButton();
  getBookmarks();
  handleSubmitForm();
  handleDeleteBookmark();
  handleFilterByRating();
  handleExpandedView();
  handleCancelButton();
}

$(handleBookmarkApp)