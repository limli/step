// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

let user = null;

/**
 * Initialize data
 */
async function init() {
  await checkUserAuthentication();
  loadMoreData();
}

/**
 * Checks if user is authenticated, and adds the contents of the top bar
 */
async function checkUserAuthentication() {
  const response = await fetch('/authenticate');
  const obj = await response.json();
  user = obj.user;
  const loginUrl = obj.login_url;
  const logoutUrl = obj.logout_url;

  const leftBar = document.getElementById('left-bar');
  const rightBar = document.getElementById('right-bar');
  const addCommentDiv = document.getElementById('add-comment');

  if (!user) {
    rightBar.innerHTML = `<a href="${loginUrl}">Login</a>`;
    addCommentDiv.innerHTML = `<a href="${loginUrl}">Login</a> to add a comment`;
  } else {
    addCommentDiv.innerHTML = `
      <form action="/comments" method="POST">
        <textarea
          class="comment-textarea"
          name="comment"
          placeholder="Your Comment..."></textarea>
        <br>
        <input type="submit" value="Add a Comment"/>
      </form>`;
    rightBar.innerHTML = '<a href="' + logoutUrl + '">Logout</a>';
    leftBar.innerText = user.email;
  }
}

/**
 * Loads more comments and adds it to the page
 * @param {string} paginationToken
 */
function loadMoreData(paginationToken = null) {
  let url='/comments';
  if (paginationToken) {
    url += '?paginationToken=' + paginationToken;
  }
  fetch(url).then((response) => response.json()).then((obj) => {
    const commentsArr = obj.comments;
    const commentsContainer = document.getElementById('comments-container');

    commentsArr.forEach((comment) => {
      const commentDiv = document.createElement('div');
      commentDiv.className = 'comment-row';

      const textDiv = document.createElement('div');
      textDiv.innerText = comment.email + ': ' + comment.comment;

      const deleteBtnDiv = document.createElement('div');
      deleteBtnDiv.className = 'alignright';
      const deleteBtn = document.createElement('button');
      deleteBtn.onclick = () => {
        commentDiv.remove();
        deleteComment(comment.id);
      };
      deleteBtn.innerText = 'Delete';
      deleteBtnDiv.appendChild(deleteBtn);

      commentDiv.appendChild(textDiv);
      commentDiv.appendChild(deleteBtnDiv);
      commentsContainer.appendChild(commentDiv);
    });

    if (commentsArr.length > 0) {
      const paginationToken = obj.paginationToken;
      const loadMoreBtn = document.createElement('button');
      loadMoreBtn.onclick = () => {
        loadMoreBtn.remove();
        loadMoreData(paginationToken);
      };
      loadMoreBtn.innerText = 'Load More...';
      commentsContainer.appendChild(loadMoreBtn);
    }
  });
}

/**
 * Deletes the comment with given id
 * @param {*} id
 */
function deleteComment(id) {
  fetch('/comments/' + id, {method: 'DELETE'});
}
