# Nathan Rowan Victvs Test BE

The backend portion of Nathan Rowan's Victvs tech test.

API Host: https://nrvictvstest.onrender.com/api

## Contains:

- Seeding scripts for SQL database
- Seeding data
- Scripts for the Express API to access the database
- API test suite

## Directories:

### GET /exams

returns an array of exam objects.

**example exam object:**

```
{
    id: "number: the individual exam's id",
    title: "string: the exam's title",
    description: "string: the exam's description",
    candidate_id: "number: the exam candidate's id",
    candidate_name: "string: the name of the exam candidate",
    date: "timestamp: the date of the exam, in yyyy-mm-ddT:hh:mm:ss.mls' format",
    location_name: "string: the location of the exam",
    latitude: "number: latitude of the exam location",
    longitude: "number: longitude of the exam location"
}
```
optional queries:
* **location**: only returns exams with the specified location
* **candidate**: only returns exams with the specified candidate id
* **date**: only returns exams on the specified date, accepts either **dd-mm-yyyy** or **yyyy-mm-dd** formats

### GET /candidates

returns an array of candidate objects.

**example exam object:**

```
{
    id: "number: the candidate's id",
    name: "string: the name of the candidate"
}
```