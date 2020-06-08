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

package com.google.sps;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public final class FindMeetingQuery {
  public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {
    List<TimeRange> unavailableTimeRanges = new ArrayList<>();
    for (Event event : events) {
      for (String atttendee : event.getAttendees()) {
        if (request.getAttendees().contains(atttendee)) {
          unavailableTimeRanges.add(event.getWhen());
        }
      }
    }

    Collection<TimeRange> availablesTimeRanges = new ArrayList<>();

    // consider the case where there is no unavailable time ranges separately to prevent out of
    // bounds call when trying to get the first element of the unavailableTimeRanges list
    if (unavailableTimeRanges.isEmpty()) {
      addTimeRangeIfLongEnough(availablesTimeRanges, request, TimeRange.WHOLE_DAY);
      return availablesTimeRanges;
    }

    unavailableTimeRanges = combineRanges(unavailableTimeRanges);

    // add the TimeRange right before the first unavailable slot
    addTimeRangeIfLongEnough(
        availablesTimeRanges,
        request,
        TimeRange.fromStartEnd(
            TimeRange.START_OF_DAY, unavailableTimeRanges.get(0).start(), false));

    // add the TimeRange between any two consecutive unavailable slot
    for (int i = 1; i < unavailableTimeRanges.size(); i++) {
      TimeRange previous = unavailableTimeRanges.get(i - 1);
      TimeRange current = unavailableTimeRanges.get(i);
      TimeRange range = TimeRange.fromStartEnd(previous.end(), current.start(), false);
      addTimeRangeIfLongEnough(availablesTimeRanges, request, range);
    }

    // add the TimeRange right after the last unavailable slot
    addTimeRangeIfLongEnough(
        availablesTimeRanges,
        request,
        TimeRange.fromStartEnd(
            unavailableTimeRanges.get(unavailableTimeRanges.size() - 1).end(),
            TimeRange.END_OF_DAY,
            true));
    return availablesTimeRanges;
  }

  /**
   * If the range's duration is shorter than the requested duration, then don't do anything. Else,
   * add it to the collection of available time ranges.
   *
   * @param availablesTimeRanges
   * @param request
   * @param range
   */
  private void addTimeRangeIfLongEnough(
      Collection<TimeRange> availablesTimeRanges, MeetingRequest request, TimeRange range) {
    if (range.duration() >= request.getDuration()) {
      availablesTimeRanges.add(range);
    }
  }

  /**
   * Returns a sorted list of TimeRange which combines any overlapping TimeRange
   *
   * @param ranges
   */
  private List<TimeRange> combineRanges(List<TimeRange> ranges) {
    List<TimeRange> answer = new ArrayList<>();
    if (ranges.isEmpty()) {
      return answer;
    }
    List<TimeRange> sortedRanges = new ArrayList<>(ranges);
    sortedRanges.sort(TimeRange.ORDER_BY_START);
    TimeRange lastEvent = sortedRanges.get(0);
    for (TimeRange range : sortedRanges) {
      if (lastEvent.overlaps(range)) {
        lastEvent =
            TimeRange.fromStartEnd(
                lastEvent.start(), Math.max(lastEvent.end(), range.end()), false);
      } else {
        answer.add(lastEvent);
        lastEvent = range;
      }
    }
    answer.add(lastEvent);
    return answer;
  }
}
