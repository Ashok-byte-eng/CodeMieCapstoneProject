Feature: Advanced Filters - Amenities, Property Type, Review Score
  As a traveler
  I want to refine accommodation search results using advanced filters
  So that I can quickly find stays that match my preferences

  Background:
    Given I am on the accommodation search page

  # Amenities filter
  Scenario: Filter results by a single amenity (Wi‑Fi)
    When I select "Wi‑Fi" in the Amenities filter
    Then only stays that offer "Wi‑Fi" are shown in the results

  Scenario: Filter results by multiple amenities using AND logic
    When I select "Wi‑Fi" and "Breakfast included" in the Amenities filter
    Then only stays that offer both "Wi‑Fi" and "Breakfast included" are shown in the results

  Scenario: No matching results shows empty state and can clear filters
    When I select amenities that no stay matches
    Then I see an empty state message
    And I can clear the applied filters

  Scenario: Amenities filter persists across pagination and sorting
    Given I selected "Wi‑Fi" in the Amenities filter
    When I navigate to the next results page
    And I change the sort order
    Then the "Wi‑Fi" filter remains applied

  # Property Type filter
  Scenario: Filter results by one property type (Hotel)
    When I select "Hotel" in the Property Type filter
    Then only stays of type "Hotel" are shown in the results

  Scenario: Filter results by multiple property types using OR logic
    When I select "Hotel" and "Villa" in the Property Type filter
    Then only stays of type "Hotel" or "Villa" are shown in the results

  Scenario: Clearing property type filter restores broader results
    Given I selected "Hotel" in the Property Type filter
    When I clear the Property Type filter
    Then the results are no longer restricted by property type

  # Review Score filter
  Scenario: Filter results by review score threshold (8+)
    When I apply the "8+" review score filter
    Then only stays with review score greater than or equal to 8 are shown

  Scenario: Unrated stays are excluded when review score filter is applied
    When I apply the "7+" review score filter
    Then no stay with review shown as "Unrated" is displayed

  Scenario: Review score filter works with other filters
    Given I selected "Wi‑Fi" in the Amenities filter
    And I select "Hotel" in the Property Type filter
    When I apply the "9+" review score filter
    Then only stays that offer "Wi‑Fi" and are of type "Hotel" and have review score at least 9 are shown