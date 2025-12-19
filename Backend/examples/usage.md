Example usage (after running server and creating user + obtaining JWT access token):

1) Create patient:
POST /api/health/patients/  (Authorization: Bearer <access>)
{
  "full_name":"Ahmed Ali",
  "dob":"1980-01-01"
}

2) Submit measurement:
POST /api/health/patients/1/measurements/
{
  "heart_rate": 110,
  "spo2": 93,
  "systolic": 145,
  "diastolic": 95,
  "respiratory_rate": 20,
  "temperature": 37.8
}

Response: 201 created, and a Prediction object will be created automatically.
3) Get prediction:
GET /api/health/measurements/1/prediction/
