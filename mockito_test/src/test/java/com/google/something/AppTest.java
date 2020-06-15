package com.google.something;

import static org.mockito.Mockito.*;

import java.util.LinkedList;
import org.junit.Assert;
import org.junit.Test;

/** Unit test for simple App. */
public class AppTest {

  @Test
  public void shouldAnswerWithTrue() {
    // you can mock concrete classes, not only interfaces
    LinkedList<String> mockedList = (LinkedList<String>) mock(LinkedList.class);

    // stubbing appears before the actual execution
    when(mockedList.get(0)).thenReturn("first");

    // the following prints "first"
    System.out.println(mockedList.get(0));
    Assert.assertEquals(mockedList.get(0), "first");

    // the following prints "null" because get(999) was not stubbed
    System.out.println(mockedList.get(999));
    Assert.assertEquals(mockedList.get(999), null);
  }
}
