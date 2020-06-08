package com.google.sps.servlets;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.gson.Gson;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Servlet that handles images. */
@WebServlet("/images")
public class ImageServlet extends HttpServlet {

  private final DatastoreService datastore;

  public ImageServlet() {
    datastore = DatastoreServiceFactory.getDatastoreService();
  }

  /** GET the image URLs as an array. */
  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {

    Query query = new Query("Image");
    PreparedQuery pq = datastore.prepare(query);

    List<String> urls = new ArrayList<>();
    for (Entity entity : pq.asIterable()) {
      String url = (String) entity.getProperty("url");
      urls.add(url);
    }

    Gson gson = new Gson();
    String json = gson.toJson(urls);
    response.setContentType("application/json;");
    response.getWriter().println(json);
  }
}
