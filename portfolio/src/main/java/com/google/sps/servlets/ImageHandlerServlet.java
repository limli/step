package com.google.sps.servlets;

import com.google.appengine.api.blobstore.BlobInfo;
import com.google.appengine.api.blobstore.BlobInfoFactory;
import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.blobstore.BlobstoreService;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.images.ImagesService;
import com.google.appengine.api.images.ImagesServiceFactory;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * When the user submits the form, Blobstore processes the file upload and then forwards the request
 * to this servlet. This servlet can then process the request using the file URL we get from
 * Blobstore.
 */
@WebServlet("/upload-image")
public class ImageHandlerServlet extends HttpServlet {

  private final BlobstoreService blobstoreService;
  private final ImagesService imagesService;
  private final DatastoreService datastore;

  public ImageHandlerServlet() {
    datastore = DatastoreServiceFactory.getDatastoreService();
    blobstoreService = BlobstoreServiceFactory.getBlobstoreService();
    imagesService = ImagesServiceFactory.getImagesService();
  }

  /** POSTs a new image and redirects to /gallery.html */
  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    // Get the URL of the image that the user uploaded to Blobstore.
    String blobKey = getUploadedFileBlobkey(request, "image");
    addBlobkeyToDatastore(blobKey);

    response.sendRedirect("/gallery.html");
  }

  private void addBlobkeyToDatastore(String blobKey) {
    Entity ImageEntity = new Entity("Image");
    ImageEntity.setProperty("blobKey", blobKey);
    datastore.put(ImageEntity);
  }

  /** Returns a URL that points to the uploaded file, or null if the user didn't upload a file. */
  private String getUploadedFileBlobkey(HttpServletRequest request, String formInputElementName) {
    Map<String, List<BlobKey>> blobs = blobstoreService.getUploads(request);
    List<BlobKey> blobKeys = blobs.get(formInputElementName);

    // User submitted form without selecting a file, so we can't get a URL. (dev server)
    if (blobKeys == null || blobKeys.isEmpty()) {
      return null;
    }

    // Our form only contains a single file input, so get the first index.
    BlobKey blobKey = blobKeys.get(0);

    // User submitted form without selecting a file, so we can't get a URL. (live server)
    BlobInfo blobInfo = new BlobInfoFactory().loadBlobInfo(blobKey);
    if (blobInfo.getSize() == 0) {
      blobstoreService.delete(blobKey);
      return null;
    }

    // TODO(limli): We could check the validity of the file here, e.g. to make sure it's an image
    // file
    // https://stackoverflow.com/q/10779564/873165

    return blobKey.getKeyString();
  }
}
