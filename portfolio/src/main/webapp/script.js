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

/**
 * Adds a random greeting to the page.
 */
function addRandomGreeting() {
  const greetings =
    ['Hello world!', '¡Hola Mundo!', '你好，世界！', 'Bonjour le monde!'];

  // Pick a random greeting.
  const greeting = greetings[Math.floor(Math.random() * greetings.length)];

  // Add it to the page.
  const greetingContainer = document.getElementById('greeting-container');
  greetingContainer.innerText = greeting;
}

/**
 * Adds the comments to the page
 */
function loadData() {
  fetch('/data').then((response) => response.json()).then((commentsArr) => {
    const commentsContainer = document.getElementById('comments-container');
    commentsContainer.innerHTML = '';
    commentsArr.forEach((comment) => {
      const commentDiv = document.createElement('div');
      commentDiv.className = 'comment-row';

      const textDiv = document.createElement('div');
      textDiv.innerHTML = comment.comment;

      const btnDiv = document.createElement('div');
      btnDiv.className = 'alignright';
      const btn = document.createElement('button');
      btn.onclick = () => deleteComment(comment.id);
      btn.innerText = 'Delete';
      btnDiv.appendChild(btn);

      commentDiv.appendChild(textDiv);
      commentDiv.appendChild(btnDiv);
      commentsContainer.appendChild(commentDiv);
    });
  });
}

/**
 * Deletes the comment with given id
 * @param {*} id
 */
function deleteComment(id) {
  const params = new URLSearchParams();
  params.append('id', id);
  fetch('/delete-data', {method: 'POST', body: params}).then(loadData);
}
