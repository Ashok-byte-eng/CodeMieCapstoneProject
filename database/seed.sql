-- Seed data for local dev/demo.
DELETE FROM accommodation_amenities;
DELETE FROM accommodations;

INSERT INTO accommodations(id,name,destination,propertyType,pricePerNight,maxPassengers,reviewScore) VALUES
  (1,'Seaside Hotel','Goa','hotel',120,2,8.7),
  (2,'Palm Villa Retreat','Goa','villa',260,4,9.1),
  (3,'City Central Hotel','Delhi','hotel',90,2,7.4),
  (4,'Lakeview Villa','Udaipur','villa',240,6,NULL),
  (5,'Budget Hotel','Goa','hotel',70,2,NULL),
  (6,'Breakfast Boutique','Delhi','hotel',140,3,9.3);

INSERT INTO accommodation_amenities(accommodationId, amenity) VALUES
  (1,'wifi'),(1,'breakfast'),
  (2,'wifi'),
  (3,'wifi'),
  (4,'breakfast'),
  (5,'wifi'),
  (6,'wifi'),(6,'breakfast');
