
/**
 * Initializes data
 */
function init() {
  fetch('/upload-image-url')
      .then((response) => {
        return response.text();
      })
      .then((imageUploadUrl) => {
        const form = document.getElementById('image-form');
        form.style.display = 'block';
        form.action = imageUploadUrl;
      });
  fetch('/images')
      .then((response) => response.json())
      .then((urlList) => {
        const gallery = document.getElementById('gallery');
        for (let i = 0; i < urlList.length; i++) {
          const img = document.createElement('img');
          img.src = urlList[i];
          gallery.appendChild(img);
        }
      });
}
