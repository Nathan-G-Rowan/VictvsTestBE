# Nathan Rowan Victvs Test BE

The backend portion of Nathan Rowan's Victvs tech test.

API Host: https://nrvictvstest.onrender.com/

## Contains:

- Seeding scripts for SQL database
- Seeding data
- Scripts for the Express API to access the database
- API test suite

## Directories:

### GET /exams

Returns an array of exam objects.

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
    latitude: "number: latitude of the exam location, must be in the range of -90 to 90",
    longitude: "number: longitude of the exam location, must be in the range of -180 to 180"
}
```

Optional queries:

- **location**: only returns exams with the specified location
- **candidate**: only returns exams with the specified candidate id
- **date**: only returns exams on the specified date, accepts either **dd-mm-yyyy** or **yyyy-mm-dd** formats

### POST /exams

Adds the input body as an exam in the database, and returns the newly created exam object.
The returned object is the same format as an exam object from GET /exams.

**example input object:**

```
{
    Title: "string: the title of the exam",
    Description: "string: a description of the exam",
    Candidateid: "number: the id of an existing candidate",
    Date: "timestamp: the date of the exam",
    LocationName: "String: the location of the exam",
    Latitude: "number: latitude of the exam location, must be in the range of -90 to 90",
    Longitude: "number: longitude of the exam location, must be in the range of -180 to 180"
}
```

### GET /candidates

Returns an array of candidate objects.

**example candidate object:**

```
{
    id: "number: the candidate's id",
    name: "string: the name of the candidate"
}
```

### POST /candidates

Inserts the input candidate object into candidates, and returns the new candidate object.
The return object is the same as a candidate object from GET /candidates.

**example input object:**

```
{
    name: "string: the name of the new candidate",
}
```
