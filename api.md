## Setup and Running

- Use `node 16.x` or higher.
- Clone this repo: `$ git clone https://github.com/mikalai-kazlou/routine.git`.
- Go to downloaded folder: `$ cd server`.
- Install dependencies: `$ npm install`.
- Start server: `$ npm run start`.
- Now you can send requests to the address: `http://127.0.0.1:5100` or `http://localhost:5100`.

![Screenshot_1](https://user-images.githubusercontent.com/108581309/216828887-f2d547bc-c046-40e6-bc71-dc8b7742cbd5.jpg)

### User

Returns json data about users.

Schema:
```
{
  "_id": string,
  "name": string,
  "email": string,
  "password": string,
  "confirmationDay": string,
  "confirmationTime": number,
  "createdAt": date
}
```

<details>
  
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
      "confirmationTime": 660,
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
  "Incorrect request"
  ```
  
  Respose `400` `Bad Request`
  ```
  "Password must be at least 3 characters long"
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
      "confirmationTime": 660,
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

- `GET` /api/users/profile
  
  Request
  `/api/users/profile`
  
  Respose `200` `OK`
  ```
  {
    "_id": "63dbd176bb3349816256d074",
    "name": "Steven Gundry",
    "email": "steven.gundry@gmail.com",
    "confirmationDay": "yesterday",
    "confirmationTime": 660,
    "createdAt": "2023-02-04T12:45:53.196Z",
    "__v": 0
  }
  ```  
  
- `POST` /api/users/update

  Request
  ```
  {
    "name": "Mr. John Doe",
    "confirmationDay": "yesterday",
    "confirmationTime": 1020
  }
  ```
  
  Respose `200` `OK`
  ```
  {
    "_id": "63dbce8efc36f95ae5646e7e",
    "name": "Mr. John Doe",
    "email": "john.doe@gmail.com",
    "confirmationDay": "yesterday",
    "confirmationTime": 1020,
    "createdAt": "2023-02-05T19:22:02.378Z",
    "__v": 0
  }
  ```
  
</details>

### Thought

Returns json data about thought.

Schema:
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
  
- `POST` /api/thought/convertToPlan/63dab20a1bad4d34504b5c18

  Request
  `/api/thoughts/convertToPlan/63dab20a1bad4d34504b5c18`
  ```
  {
    "title": "Do gym every morning",
    "text": "Lorem ipsum",
    "color": "#549F7B",
    "duration": 120
  }
  ```
  
  Respose `200` `OK`
  ```
  {
    "_id": "63dab20a1bad4d34504b5c18",
    "userId": 63dd5008939161908112e05f,
    "title": "Do gym every morning",
    "text": "Lorem ipsum",
    "color": "#549F7B",
    "duration": 120
    "__v": 0
  }
  ``` 
  
</details>

### Plan

Returns json data about user's plans.

Schema:
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
      "duration": 75,
      "__v": 0
    },
    {
      "_id": "63e15e1027cf884cc5d1ef99",
      "userId": "63df879ff7a5081606fb4fb8",
      "title": "Plan 2",
      "text": "Lorem ipsum",
      "color": "#FF00FF",
      "duration": 60,
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
    "duration": 60,
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
    "duration": 60
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
    "duration": 60,
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
    "duration": 60,
    "__v": 0
  }
  ```
  
- `POST` /api/plans/update
  
  Request
  ```
  {
    "_id": "63e158255010e434534cfae5",
    "title": "Plan 3",
    "text": "Lorem ipsum",
    "color": "#FF00FF",
    "duration": 75
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
    "duration": 75,
    "__v": 0
  }
  ```

</details>

### Week distribution

Returns json data about the distribution of time during the week.

Schema:
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
        "duration": 75,
        "__v": 0
      },
      {
        "_id": "63e15e1027cf884cc5d1ef99",
        "userId": "63df879ff7a5081606fb4fb8",
        "title": "Plan 2",
        "text": "Lorem ipsum",
        "color": "#FF00FF",
        "duration": 60,
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
  
- `POST` /api/weekDistribution/adjustPlan
  
  Request (from page of the week)
  ```
  {
    "dayOfWeek": 0,
    "planId": 63e158255010e434534cfae5,
    "duration": 120
  }
  ```
  
  Request (from page of the day)
  ```
  {
    "dayOfWeek": 0,
    "planId": 63e158255010e434534cfae5,
    "duration": -120
  }
  ```
  
  Respose `200` `OK`
  ```
  {
    "_id": 63e158255010e434534cfae5,
    "userId": 63df879ff7a5081606fb4fb8,
    "dayOfWeek": 0,
    "planId": 63e158255010e434534cfae5,
    "duration": 120,
    "__v": 0
  }
  ```
  
  Respose `400` `Bad Request`
  ```
  "The user has no plan with ID 63e158255010e434534cfae5"
  ```
  
  Respose `400` `Bad Request`
  ```
  "The plan duration is less than distributed"
  ```

</details>

### Day distribution

Returns json data about the distribution of time during the day.

Schema:
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

- `GET` /api/dayDistribution/get/:dayOfWeek
  
  Respose `200` `OK`
  ```
  {
    "distributedPlans": [
      {
        "_id": "63e158255010e434534cfae5",
        "userId": "63df879ff7a5081606fb4fb8",
        "title": "Plan 1",
        "text": "Lorem ipsum",
        "color": "#FF00FF",
        "from": 660,
        "to": 720,
        "__v": 0
      },
      {
        "_id": "63e15e1027cf884cc5d1ef99",
        "userId": "63df879ff7a5081606fb4fb8",
        "title": "Plan 2",
        "text": "Lorem ipsum",
        "color": "#FF00FF",
        "from": 900,
        "to": 990,
        "__v": 0
      }
    ],
    "notDistributedPlans": [
      {
        "_id": "63e158255010e434534cfae5",
        "userId": "63df879ff7a5081606fb4fb8",
        "title": "Plan 3",
        "text": "Lorem ipsum",
        "color": "#FF00FF",
        "duration": 135,
        "__v": 0
      },
      {
        "_id": "63e15e1027cf884cc5d1ef99",
        "userId": "63df879ff7a5081606fb4fb8",
        "title": "Plan 4",
        "text": "Lorem ipsum",
        "color": "#FF00FF",
        "duration": 105,
        "__v": 0
      }
    ]
  }
  ```
  
- `POST` /api/dayDistribution/adjustPlan
  
  Request
  ```
  {
    "dayOfWeek": 0,
    "dayDistribution": [
      {
        "planId": "63e158255010e434534cfae5",
        "from": 600,
        "to": 660
      },
      {
        "planId": "63e158255010e434534cfae5",
        "from": 660,
        "to": 720
      },
      {
        "planId": "63e158255010e434534cfae5",
        "from": 900,
        "to": 960
      }
    ]
  }
  ```
  
  Respose `200` `OK`
  ```
  [
    {
      "_id": 63e158255010e434534cfae5,
      "userId": 63df879ff7a5081606fb4fb8,
      "dayOfWeek": 0,
      "planId": 63e158255010e434534cfae5,
      "from": 600,
      "to": 660
      "__v": 0
    },
    {
      "_id": 63e158255010e434534cfae5,
      "userId": 63df879ff7a5081606fb4fb8,
      "dayOfWeek": 0,
      "planId": 63e158255010e434534cfae5,
      "from": 660,
      "to": 720
      "__v": 0
    },
    {
      "_id": 63e158255010e434534cfae5,
      "userId": 63df879ff7a5081606fb4fb8,
      "dayOfWeek": 0,
      "planId": 63e158255010e434534cfae5,
      "from": 900,
      "to": 960
      "__v": 0
    },
  ]
  ```

</details>

### Statistics

Returns json data about the user statistics.

Schema:
```
{
  "_id": string,
  "userId": string,
  "planId": string,
  "deviation": number,
  "confirmedDate": date
}
```

<details>

- `GET` /api/statistics/get
  
  Respose `200` `OK`
  ```
  [
    {
      "_id": "63e5055da4b15d5eb3b0be2f",
      "userId": "63e001da88d251dc53e36d1f",
      "title": "Plan 6",
      "text": "Lorem ipsum",
      "color": "#FF00FF",
      "deviation": 15
      "__v": 0
    },
    {
      "_id": "63e69c64ca00602898c89ff1",
      "userId": "63e001da88d251dc53e36d1f",
      "title": "Thought test 12-4",
      "text": "Do gym every morning",
      "color": "#549F7B",
      "deviation": -20
      "__v": 0
    },
    {
      "_id": "63e158255010e434534cfae5",
      "userId": "63e001da88d251dc53e36d1f",
      "title": "Plan 3",
      "text": "Lorem ipsum",
      "color": "#FF00FF",
      "deviation": 10
      "__v": 0
    }
  ]
  ```
  
- `POST` /api/statistics/confirmDay
  
  Request
  ```
  {
    "dayOfWeek": 0,
    "dayDistribution": [
      {
        "planId": "63e158255010e434534cfae5",
        "duration": 60
      },
      {
        "planId": "63e158255010e434534cfae5",
        "duration": 120
      },
      {
        "planId": "63e158255010e434534cfae5",
        "duration": 75
      }
    ]
  }
  ```
  
  Respose `200` `OK`
  ```
  [
    {
      "_id": 63e158255010e434534cfae5,
      "userId": 63df879ff7a5081606fb4fb8,
      "planId": 63e158255010e434534cfae5,
      "deviation": 15
      "__v": 0
    },
    {
      "_id": 63e158255010e434534cfae5,
      "userId": 63df879ff7a5081606fb4fb8,
      "planId": 63e158255010e434534cfae5,
      "deviation": -20
      "__v": 0
    },
    {
      "_id": 63e158255010e434534cfae5,
      "userId": 63df879ff7a5081606fb4fb8,
      "planId": 63e158255010e434534cfae5,
      "deviation": 10
      "__v": 0
    }
  ]
  ```

  - `GET` /api/statistics/isDayConfirmed
  
  Respose `200` `OK`
  ```
  true/false
  ```
  
</details>
