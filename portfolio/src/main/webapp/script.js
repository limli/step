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

  const userBar = document.getElementById('user-bar');
  const addCommentDiv = document.getElementById('add-comment');

  if (!user) {
    userBar.innerHTML = `
      <ul class="navbar-nav">
        <li>
          <a class="nav-link" href="${loginUrl}">
            <i class="fa fa-sign-in" aria-hidden="true"></i> Login
          </a>
        </li>
      </ul>`;
    addCommentDiv.innerHTML = `<a href="${loginUrl}">
        Login
      </a> to add a comment`;
  } else {
    userBar.innerHTML = `
      <ul class="navbar-nav">
        <li>
          <span class="navbar-text pr-2">
            <i class="fa fa-user" aria-hidden="true"></i> ${user.email}
          </span>
        </li>
        <li>
          <a class="nav-link" href="${logoutUrl}">
            <i class="fa fa-sign-out" aria-hidden="true"></i> Logout
          </a>
        </li>
      </ul>`;
    addCommentDiv.innerHTML = `
      <form action="/comments" method="POST">
        <div class="form-group">
          <textarea
            class="form-control"
            name="comment"
            placeholder="Your Comment..."></textarea>
        </div>
        <input class="btn btn-primary " type="submit" value="Add a Comment"/>
      </form>`;
  }
}

/**
 * Loads more comments and adds it to the page
 * @param {string} paginationToken
 */
function loadMoreData(paginationToken = null) {
  let url = '/comments';
  if (paginationToken) {
    url += '?paginationToken=' + paginationToken;
  }
  fetch(url).then((response) => response.json()).then((obj) => {
    const commentsArr = obj.comments;
    const commentsContainer = document.getElementById('comments-container');
    const tbody = commentsContainer.querySelector('tbody');

    commentsArr.forEach((comment) => {
      const commentRow = document.createElement('tr');
      tbody.appendChild(commentRow);
      const commentCell = document.createElement('td');
      commentRow.appendChild(commentCell);

      const textDiv = document.createElement('div');
      textDiv.innerText = comment.email + ': ' + comment.comment;
      commentCell.appendChild(textDiv);

      if (user && user.email == comment.email) {
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-danger btn-sm float-right';
        deleteBtn.onclick = () => {
          commentRow.remove();
          deleteComment(comment.id);
        };
        deleteBtn.innerHTML = '<i class="fa fa-trash"></i>';
        commentCell.appendChild(deleteBtn);
      }
    });

    if (commentsArr.length == 5) {
      const paginationToken = obj.paginationToken;
      const loadMoreBtn = document.createElement('button');
      loadMoreBtn.className = 'btn btn-secondary btn-block';
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
