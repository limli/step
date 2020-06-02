package com.google.sps.servlets;

import com.google.gson.Gson;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/covid-data")
public class CovidDataServlet extends HttpServlet {

  // Maps: Country -> (Date -> Confirmed)
  private Map<String, Map<String, Integer>> covidCases = new HashMap<>();

  @Override
  public void init() {
    Scanner scanner =
        new Scanner(getServletContext().getResourceAsStream("/WEB-INF/covid_cases.csv"));
    while (scanner.hasNextLine()) {
      String line = scanner.nextLine();
      String[] cells = line.split(",");

      String date = cells[0];
      String country = cells[1];
      Integer confirm = Integer.valueOf(cells[2]);

      if (!covidCases.containsKey(country)) {
        Map<String, Integer> map = new HashMap<>();
        covidCases.put(country, map);
      }

      Map<String, Integer> countryMap = covidCases.get(country);
      countryMap.put(date, confirm);
    }
    scanner.close();
  }

  /**
   * Gets authentication information (login url, logout url, user). If user is not logged in, user
   * will be null.
   */
  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String countriesParam = request.getParameter("countries");
    if (countriesParam == null) {
      response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
      return;
    }
    Map<String, Map<String, Integer>> map = new HashMap<>();
    String[] countries = countriesParam.split(",");
    for (int i = 0; i < countries.length; i++) {
      String country = countries[i];
      if (covidCases.containsKey(country)) {
        map.put(country, covidCases.get(country));
      }
    }

    Gson gson = new Gson();
    String json = gson.toJson(map);
    response.setContentType("application/json;");
    response.getWriter().println(json);
  }
}
