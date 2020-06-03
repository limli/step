package com.google.sps.servlets;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Servlet that handles deleting comments. */
@WebServlet("/comments/*")
public class DeleteServlet extends HttpServlet {

  private final DatastoreService datastore;
  private final UserService userService;

  public DeleteServlet() {
    datastore = DatastoreServiceFactory.getDatastoreService();
    userService = UserServiceFactory.getUserService();
  }

  /** Deletes the comment with the given id parameter */
  @Override
  public void doDelete(HttpServletRequest request, HttpServletResponse response)
      throws IOException {
    if (!userService.isUserLoggedIn()) {
      response.setStatus(HttpServletResponse.SC_FORBIDDEN);
      return;
    }

    long id = Long.parseLong(request.getPathInfo().substring(1));
    String userEmail = userService.getCurrentUser().getEmail();

    Key taskEntityKey = KeyFactory.createKey("Comment", id);
    Entity comment;
    try {
      comment = datastore.get(taskEntityKey);
    } catch (EntityNotFoundException e) {
      response.setStatus(HttpServletResponse.SC_NOT_FOUND);
      return;
    }

    String commentEmail = (String) comment.getProperty("email");
    if (!commentEmail.equals(userEmail)) {
      response.setStatus(HttpServletResponse.SC_FORBIDDEN);
      return;
    }

    datastore.delete(taskEntityKey);
  }
}
