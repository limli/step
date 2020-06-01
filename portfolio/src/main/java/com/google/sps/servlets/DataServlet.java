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

package com.google.sps.servlets;

import com.google.appengine.api.datastore.Cursor;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.FetchOptions;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.appengine.api.datastore.QueryResultList;
import com.google.gson.Gson;
import com.google.sps.data.Comment;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Servlet that handles comments. */
@WebServlet("/comments")
public class DataServlet extends HttpServlet {

  private final DatastoreService datastore;

  static final int PAGE_SIZE = 5;

  public DataServlet() {
    datastore = DatastoreServiceFactory.getDatastoreService();
  }

  /** GET the comments as a json array. */
  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {

    Query query = new Query("Comment").addSort("timestamp", SortDirection.DESCENDING);
    PreparedQuery pq = datastore.prepare(query);

    FetchOptions fetchOptions = FetchOptions.Builder.withLimit(PAGE_SIZE);
    String paginationToken = request.getParameter("paginationToken");
    if (paginationToken != null) {
      fetchOptions.startCursor(Cursor.fromWebSafeString(paginationToken));
    }

    QueryResultList<Entity> results;
    try {
      results = pq.asQueryResultList(fetchOptions);
    } catch (IllegalArgumentException e) {
      // invalid cursor used
      response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
      return;
    }

    List<Comment> list = new ArrayList<>();
    for (Entity entity : results) {
      long id = entity.getKey().getId();
      String str = (String) entity.getProperty("comment");
      long timestamp = (long) entity.getProperty("timestamp");

      Comment comment = new Comment(id, str, timestamp);
      list.add(comment);
    }

    String newPaginationToken = results.getCursor().toWebSafeString();

    Map<String, Object> map = new HashMap<>();
    map.put("comments", list);
    map.put("paginationToken", newPaginationToken);
    Gson gson = new Gson();
    String json = gson.toJson(map);
    response.setContentType("application/json;");
    response.getWriter().println(json);
  }

  /** POST a new comment and redirects to /index.html. */
  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String comment = request.getParameter("comment");

    Entity commentEntity = new Entity("Comment");
    commentEntity.setProperty("comment", comment);
    commentEntity.setProperty("timestamp", System.currentTimeMillis());

    datastore.put(commentEntity);

    response.sendRedirect("/index.html");
  }
}
