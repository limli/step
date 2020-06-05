
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
}
