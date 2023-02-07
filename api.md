## API

- Internal: http://localhost:5100
- External: https://warm-bayou-30321.herokuapp.com

### Start local server

```
> cd server
> npm run start
```
![Screenshot_1](https://user-images.githubusercontent.com/108581309/216828887-f2d547bc-c046-40e6-bc71-dc8b7742cbd5.jpg)

### User

Returns json data about users.

```
{
  "_id": string,
  "name": string,
  "email": string,
  "password": string,
  "confirmationDay": string,
  "confirmationTime": string,
  "createdAt": date
}
```

<details>

- `GET` /api/users
  
  Respose `200` `OK`
  ```
  [
    {
      "_id": "63dbce8efc36f95ae5646e7e",
      "name": "John Doe",
      "email": "john.doe@gmail.com",
      "confirmationDay": "today",
      "confirmationTime": "16:00",
      "createdAt": "2023-02-05T18:15:14.997Z",
      "__v": 0
    },
    {
      "_id": "63dbd176bb3349816256d074",
      "name": "Steven Gundry",
      "email": "steven.gundry@gmail.com",
      "confirmationDay": "yesterday",
      "confirmationTime": "11:00",
      "createdAt": "2023-02-04T12:45:53.196Z",
      "__v": 0
    }
  ]
  ```  
  
- `GET` /api/users/:id
  
  Request
  `/api/users/63dbd176bb3349816256d074`
  
  Respose `200` `OK`
  ```
  {
    "_id": "63dbd176bb3349816256d074",
    "name": "Steven Gundry",
    "email": "steven.gundry@gmail.com",
    "confirmationDay": "yesterday",
    "confirmationTime": "11:00",
    "createdAt": "2023-02-04T12:45:53.196Z",
    "__v": 0
  }
  ```
  
- `DELETE` /api/users/:id 
  
  Request
  `/api/users/63dbd176bb3349816256d074`
  
  Respose `200` `OK`
  ```
  {
    "_id": "63dbd176bb3349816256d074",
    "name": "Steven Gundry",
    "email": "steven.gundry@gmail.com",
    "confirmationDay": "yesterday",
    "confirmationTime": "11:00",
    "createdAt": "2023-02-04T12:45:53.196Z",
    "__v": 0
  }
  ```
  
- `POST` /api/users/registration
  
  Request
  ```
  {
    "name": "John Doe",
    "email": "john.doe@gmail.com",
    "password": "12345"
  }
  ```
  
  Respose `200` `OK`
  ```
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZTAwMWRhODhkMjUxZGM1M2UzNmQxZiIsIml
              hdCI6MTY3NTYyNDkyMiwiZXhwIjoxNzYyMDI0OTIyfQ.KtnvX9m92FTlIVU_6HZneTVmYOX-8U5oO8dYPvcJba8",
    "user": 
    {
      "_id": "63e001da88d251dc53e36d1f",
      "name": "John Doe",
      "email": "john.doe@gmail.com",
      "confirmationDay": "yesterday",
      "confirmationTime": "11:00",
      "createdAt": "2023-02-05T19:22:02.378Z",
      "__v": 0
    }
  }
  ```
  
  Respose `400` `Bad Request`
  ```
  "User with email john.doe@gmail.com already exist"
  ```
  
  Respose `400` `Bad Request`
  ```
  {
    "message": "Incorrect request",
    "errors": {
      "errors": [
        {
          "value": "user-gmail.com",
          "msg": "Incorrect email",
          "param": "email",
          "location": "body"
        },
        {
          "value": "1",
          "msg": "Password must be longer than 3 and shorter than 12 symbols",
          "param": "password",
          "location": "body"
        }
      ]
    }
  }
  ```
  
- `POST` /api/users/login
  
  Request
  ```
  {
    "email": "john.doe@gmail.com",
    "password": "12345",
    "remember": false
  }
  ```
  
  Respose `200` `OK`
  ```
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZTAwMWRhODhkMjUxZGM1M2UzNmQxZiIsIml
              hdCI6MTY3NTYyNDkyMiwiZXhwIjoxNzYyMDI0OTIyfQ.KtnvX9m92FTlIVU_6HZneTVmYOX-8U5oO8dYPvcJba8",
    "user": 
    {
      "_id": "63e001da88d251dc53e36d1f",
      "name": "John Doe",
      "email": "john.doe@gmail.com",
      "confirmationDay": "yesterday",
      "confirmationTime": "11:00",
      "createdAt": "2023-02-05T19:22:02.378Z",
      "__v": 0
    }
  }
  ```
  
  Respose `404` `Not Found`
  ```
  "User with email john.doe@gmail.com not found"
  ```
  
  Respose `400` `Bad Request`
  ```
  "Invalid password"
  ```
  
- `POST` /api/users/update

  Request
  ```
  {
    "_id": "63dbce8efc36f95ae5646e7e",
    "name": "Mr. John Doe",
    "confirmationDay": "yesterday",
    "confirmationTime": "17:00"
  }
  ```
  
  Respose `200` `OK`
  ```
  {
    "_id": "63dbce8efc36f95ae5646e7e",
    "name": "Mr. John Doe",
    "email": "john.doe@gmail.com",
    "confirmationDay": "yesterday",
    "confirmationTime": "17:00",
    "createdAt": "2023-02-05T19:22:02.378Z",
    "__v": 0
  }
  ```
  
</details>

### Thought

Returns json data about thought.

```
{
  "_id": string,
  "userId": string,
  "title": string
}
```

<details>

- `GET` /api/thoughts
  
  Respose `200` `OK`
  ```
  [
    {
      "_id": "63dab20a1bad4d34504b5c18",
      "userId": 63dd5008939161908112e05f,
      "title": "Do gym every morning",
      "__v": 0
    },
    {
      "_id": "63dab436cc8fdc25bfe20d39",
      "userId": 63dd5008939161908112e05f,
      "title": "Buy a quadcopter",
      "__v": 0
    }
  ]
  ```
  
- `GET` /api/thoughts/:id
  
  Request
  `/api/thoughts/63dab20a1bad4d34504b5c18`
  
  Respose `200` `OK`
  ```
  {
    "_id": "63dab20a1bad4d34504b5c18",
    "userId": 63dd5008939161908112e05f,
    "title": "Do gym every morning",
    "__v": 0
  }
  ```
  
- `POST` /api/thoughts
    
  Request
  ```
  {
    "title": "Do gym every morning"
  }
  ```
  
  Respose `200` `OK`
  ```
  {
    "_id": "63dab20a1bad4d34504b5c18",
    "userId": 63dd5008939161908112e05f,
    "title": "Do gym every morning",
    "__v": 0
  }
  ```
  
- `POST` /api/thoughts/update
  
  Request
  ```
  {
    "_id": "63de721eb2cdc7d1460b9b08",
    "title": "Work out at the gym every weekend"
  }
  ```
  
  Respose `200` `OK`
  ```
  {
    "_id": "63de721eb2cdc7d1460b9b08",
    "userId": 63dd5008939161908112e05f,
    "title": "Work out at the gym every weekend",
    "__v": 0
  }
  ```
  
- `DELETE` /api/thoughts/:id

  Request
  `/api/thoughts/63dab20a1bad4d34504b5c18`
  
  Respose `200` `OK`
  ```
  {
    "_id": "63dab20a1bad4d34504b5c18",
    "userId": 63dd5008939161908112e05f,
    "title": "Do gym every morning",
    "__v": 0
  }
  ```
  
- `POST` /api/thought/transferToPlan/?id=63dab20a1bad4d34504b5c18

  Request
  `/api/thought/transferToPlan/?id=63dab20a1bad4d34504b5c18`
  
  Respose `200` `OK`
  ```
  {
    "_id": "63dab20a1bad4d34504b5c18",
    "title": "Do gym every morning",
    "userId": 63dd5008939161908112e05f,
    "text": "",
    "color": "",
    "duration": 0
    "__v": 0
  }
  ``` 
  
</details>

### Plan

Returns json data about user's plans.

```
{
  "_id": string,
  "title": string,
  "text": string,
  "color": string,
  "duration": number
}
```

<details>

- `GET` /api/plans
  
  Respose `200` `OK`
  ```
  [
    {
      "_id": "63e158255010e434534cfae5",
      "userId": "63df879ff7a5081606fb4fb8",
      "title": "Plan 1",
      "text": "Lorem ipsum",
      "color": "#FF00FF",
      "duration": 15.25,
      "__v": 0
    },
    {
      "_id": "63e15e1027cf884cc5d1ef99",
      "userId": "63df879ff7a5081606fb4fb8",
      "title": "Plan 2",
      "text": "Lorem ipsum",
      "color": "#FF00FF",
      "duration": 5.25,
      "__v": 0
    }
  ]
  ```
  
- `GET` /api/plans/:id
  
  Request
  `/api/plans/63e15e1027cf884cc5d1ef99`
  
  Respose `200` `OK`
  ```
  {
    "_id": "63e15e1027cf884cc5d1ef99",
    "userId": "63df879ff7a5081606fb4fb8",
    "title": "Plan 2",
    "text": "Lorem ipsum",
    "color": "#FF00FF",
    "duration": 5.25,
    "__v": 0
  }
  ```
  
- `POST` /api/plans
  
  Request
  ```
  {
    "title": "Plan 3",
    "text": "Lorem ipsum",
    "color": "#FF00FF",
    "duration": 5.25
  }
  ```
  
  Respose `200` `OK`
  ```
  {
    "_id": "63e16f5dfdeef06fd34174ce",
    "userId": "63df879ff7a5081606fb4fb8",
    "title": "Plan 3",
    "text": "Lorem ipsum",
    "color": "#FF00FF",
    "duration": 5.25,
    "__v": 0
  }
  ```
  
- `DELETE` /api/plans/:id
  
  Request
  `/api/plans/63e16f5dfdeef06fd34174ce`
  
  Respose `200` `OK`
  ```
  {
    "_id": "63e16f5dfdeef06fd34174ce",
    "userId": "63df879ff7a5081606fb4fb8",
    "title": "Plan test 3",
    "text": "Lorem ipsum",
    "color": "#FF00FF",
    "duration": 5.25,
    "__v": 0
  }
  ```
  
- `POST` /api/plans/update
  
  Request
  ```
  {
    "_id": "63e158255010e434534cfae5",
    "title": "Plan 3",
    "color": "#FF00FF",
    "duration": 15.25
  }
  ```
  
  Respose `200` `OK`
  ```
  {
    "_id": "63e158255010e434534cfae5",
    "userId": "63df879ff7a5081606fb4fb8",
    "title": "Plan 3",
    "text": "Lorem ipsum",
    "color": "#FF00FF",
    "duration": 15.25,
    "__v": 0
  }
  ```

</details>

### Week distribution

Returns json data about the distribution of time during the week.

```
{
  "_id": string,
  "userId": string,
  "dayOfWeek": number,
  "planId": string,
  "duration": number
}
```

<details>

- `GET` /api/weekDistribution/get
  
  Respose `200` `OK`
  ```
  [
    [
      {
        "_id": "63e158255010e434534cfae5",
        "userId": "63df879ff7a5081606fb4fb8",
        "title": "Plan 1",
        "text": "Lorem ipsum",
        "color": "#FF00FF",
        "duration": 15.25,
        "__v": 0
      },
      {
        "_id": "63e15e1027cf884cc5d1ef99",
        "userId": "63df879ff7a5081606fb4fb8",
        "title": "Plan 2",
        "text": "Lorem ipsum",
        "color": "#FF00FF",
        "duration": 5.25,
        "__v": 0
      }
    ],
    [],
    [],
    [],
    [],
    [],
    []
  ]
  ```
  
- `POST` /api/weekDistribution/updateDay

</details>

### Day distribution

Returns json data about the distribution of time during the day.

```
{
  "_id": string,
  "userId": string,
  "dayOfWeek": number,
  "planId": string,
  "from": number,
  "to": number,
}
```

<details>

- `GET` /api/dayDistribution/?dayOfWeek=''
- `POST` /api/dayDistribution
- `DELETE` /api/dayDistribution/:id
- `POST` /api/dayDistribution/update

</details>

### Statistics

Returns json data about the user statistics.

```
{
  "_id": string,
  "userId": string,
  "planId": string,
  "deviation": number
}
```

<details>

- `GET` /api/statistics
- `POST` /api/statistics/confirmDay

</details>
