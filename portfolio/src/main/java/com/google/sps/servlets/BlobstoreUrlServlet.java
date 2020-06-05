package com.google.sps.servlets;

import com.google.appengine.api.blobstore.BlobstoreService;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * This servlet prints out the HTML for the homepage. You wouldn't do this in a real codebase, but
 * this is meant to demonstrate getting a Blobstore URL and using it in a form to allow a user to
 * upload a file.
 */
@WebServlet("/upload-image-url")
public class BlobstoreUrlServlet extends HttpServlet {

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {

    // Get the Blobstore URL
    BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();
    String uploadUrl = blobstoreService.createUploadUrl("/upload-image");

    response.setContentType("text/html");
    PrintWriter out = response.getWriter();
    out.println(uploadUrl);
  }
}
