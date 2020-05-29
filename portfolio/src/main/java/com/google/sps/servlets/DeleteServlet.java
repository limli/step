package com.google.sps.servlets;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Servlet that handles deleting comments. */
@WebServlet("/delete-data")
public class DeleteServlet extends HttpServlet {

  private final DatastoreService datastore;

  public DeleteServlet() {
    datastore = DatastoreServiceFactory.getDatastoreService();
  }

  /** Deletes the comment with the given id parameter */
  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    long id = Long.parseLong(request.getParameter("id"));

    Key taskEntityKey = KeyFactory.createKey("Comment", id);
    datastore.delete(taskEntityKey);
  }
}
