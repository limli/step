package com.google.sps.servlets;

import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.gson.Gson;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/authenticate")
public class AuthenticationServlet extends HttpServlet {

  private UserService userService;

  public AuthenticationServlet() {
    userService = UserServiceFactory.getUserService();
  }

  /**
   * Gets authentication information (login url, logout url, user). If user is not logged in, user
   * will be null.
   */
  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    Map<String, Object> map = new HashMap<>();
    map.put("login_url", userService.createLoginURL("/index.html"));
    map.put("logout_url", userService.createLogoutURL("/index.html"));
    map.put("user", userService.getCurrentUser());

    Gson gson = new Gson();
    String json = gson.toJson(map);
    response.setContentType("application/json;");
    response.getWriter().println(json);
  }
}
