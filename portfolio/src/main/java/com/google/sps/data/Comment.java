package com.google.sps.data;

/** A comment on the page */
public class Comment {
  private final long id;
  private final String email;
  private final String comment;
  private final long timestamp;

  public Comment(long id, String email, String comment, long timestamp) {
    this.id = id;
    this.email = email;
    this.comment = comment;
    this.timestamp = timestamp;
  }
}
