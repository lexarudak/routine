## API

- Internal: http://localhost:5000
- External: https://warm-bayou-30321.herokuapp.com

### User

Returns json data about users.

```
{
  "_id": string,
  "name": string,
  "email": string,
  "password": string,
  "createdAt": date
}
```

<details>

- `GET` /api/users
- `GET` /api/users/:id
- `DELETE` /api/users/:id  
- `POST` /api/users/registration
- `POST` /api/users/login
- `POST` /api/users/update

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

- `GET` /api/thoughts/?userId=63dd5008939161908112e05f
  
  Respose
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
  
  Respose
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
    "userId": 63dd5008939161908112e05f,
    "title": "Do gym every morning"
  }
  ```
  
  Respose
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
  
  Respose
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
  
  Respose
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
  
  Respose
  ```
  {
    "_id": "63dab20a1bad4d34504b5c18",
    "title": "Do gym every morning",
    "text": "",
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
  "userId": string,
  "title": string,
  "text": string,
  "duration": number
}
```

<details>

- `GET` /api/plans/?userId=''
- `GET` /api/plans/:id
- `POST` /api/plans
- `DELETE` /api/plans/:id
- `POST` /api/plans/update

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

- `GET` /api/weekDistribution/?userId=''
- `POST` /api/weekDistribution
- `DELETE` /api/weekDistribution/:id
- `POST` /api/weekDistribution/update

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

- `GET` /api/dayDistribution/?userId=''&dayOfWeek=''
- `POST` /api/weekDistribution
- `DELETE` /api/weekDistribution/:id
- `POST` /api/weekDistribution/update

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

- `GET` /api/statistics/?userId=''
- `POST` /api/statistics/confirmDay

</details>

### UserSettings

Returns json data about the user settings.

```
{
  "_id": string,
  "userId": string,
  "confirmationDay": string,
  "confirmationTime": number
}
```

<details>

- `GET` /api/userSettings/?userId=''
- `POST` /api/userSettings/update

</details>
