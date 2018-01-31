-- bin/cqlsh
DROP KEYSPACE IF EXISTS eventlogger;
CREATE KEYSPACE eventlogger WITH REPLICATION = {
    -- 'class': 'NetworkTopologyStrategy', 
    'class': 'SimpleStrategy', 
    'replication_factor': 3
};
use eventlogger;

DROP TABLE IF EXISTS eventlogger.pricing_service_logs;
DROP TABLE IF EXISTS eventlogger.ridematching_service_logs;
DROP TABLE IF EXISTS eventlogger.avg_surge_by_city;
DROP TABLE IF EXISTS eventlogger.avg_drivers_by_city;
 
CREATE TABLE pricing_service_logs (
    userId INT, 
    pickUpLocationLat FLOAT, 
    pickUpLocationLong FLOAT, 
    dropOffLocationLat FLOAT, 
    dropOffLocationLong FLOAT, 
    surgeMultiplier FLOAT, 
    price VARCHAR, 
    priceTimeStamp TIMESTAMP, 
    PRIMARY KEY(priceTimeStamp)
);

    -- (userId, pickUpLocationLat, pickUpLocationLong, dropOffLocationLat, dropOffLocationLong, surgeMultiplier, price, priceTimeStamp) 

CREATE TABLE ridematching_service_logs (
    userId INT, 
    priceTimeStamp TIMESTAMP,
    PRIMARY KEY(priceTimeStamp)
);

CREATE TABLE avg_surge_by_city (
    city VARCHAR, 
    day VARCHAR,
    timeInterval VARCHAR, 
    surgeMultiplier FLOAT, 
    PRIMARY KEY((city,day), timeInterval)
);

CREATE TABLE avg_drivers_by_city (
    city VARCHAR, 
    day VARCHAR,
    timeInterval VARCHAR,  
    avgDrivers FLOAT,
    PRIMARY KEY((city,day), timeInterval)
);

-- CREATE TABLE temperature_by_day (
--     weatherstation_id text,
--     date text,
--     event_time timestamp,
--     temperature text,
--     PRIMARY KEY ((weatherstation_id,date),event_time)
-- );

-- CREATE KEYSPACE test WITH REPLICATION = {
--     'class': 'SimpleStrategy', 
--     'replication_factor': 1
-- };

-- INSERT INTO test.temperature_by_day(weatherstation_id,date,event_time,temperature) VALUES ('1234ABCD','2013-04-03','2013-04-03 07:01:00','72F');

-- INSERT INTO test.temperature_by_day(weatherstation_id,date,event_time,temperature) VALUES ('1234ABCD','2013-04-03','2013-04-03 07:02:00','73F');

-- INSERT INTO test.temperature_by_day(weatherstation_id,date,event_time,temperature) VALUES ('1234ABCD','2013-04-04','2013-04-04 07:01:00','73F');

-- INSERT INTO test.temperature_by_day(weatherstation_id,date,event_time,temperature) VALUES ('1234ABCD','2013-04-04','2013-04-04 07:02:00','74F');

-- SELECT * FROM temperature_by_day WHERE weatherstation_id='1234ABCD' AND date='2013-04-03';
