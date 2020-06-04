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
  private Map<String, Map<Long, Integer>> covidCases = new HashMap<>();

  @Override
  public void init() {
    Scanner scanner =
        new Scanner(getServletContext().getResourceAsStream("/WEB-INF/covid_cases.csv"));
    while (scanner.hasNextLine()) {
      String line = scanner.nextLine();
      String[] cells = line.split(",");

      long date = Long.valueOf(cells[0]);
      String country = cells[1];
      Integer confirmedCases = Integer.valueOf(cells[2]);

      covidCases.putIfAbsent(country, new HashMap<>());
      Map<Long, Integer> countryMap = covidCases.get(country);
      countryMap.put(date, confirmedCases);
    }
    scanner.close();
  }

  /** Gets the covid data of the countries specified in the query string */
  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String countriesParam = request.getParameter("countries");
    if (countriesParam == null) {
      response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
      return;
    }
    Map<String, Map<Long, Integer>> map = new HashMap<>();
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
