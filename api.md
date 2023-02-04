## API

- Internal: http://localhost:5000
- External: https://warm-bayou-30321.herokuapp.com

### Users

Returns json data about users. Registration, authorization actions.

```
{
  "_id": string,
  "name": string,
  "email": string,
  "password": string,
  "createdOn": date
}
```

<details>

- `GET` /api/users
- `GET` /api/users/:id
- `POST` /api/registration
- `POST` /api/login
- `PUT` /api/users
- `DELETE` /api/users/:id

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

- `GET` /api/thoughts/:userId
  
  Respose
  ```
  [
    {
      "_id": "63dab20a1bad4d34504b5c18",
      "title": "Do gym every morning",
      "__v": 0
    },
    {
      "_id": "63dab436cc8fdc25bfe20d39",
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
    "title": "Do gym every morning",
    "__v": 0
  }
  ```
  
- `POST` /api/thoughts/:userId
    
  Request
  
  ```
  {
    "title": "Do gym every morning"
  }
  ```
  
  Respose
  ```
  {
    "_id": "63dab20a1bad4d34504b5c18",
    "title": "Do gym every morning",
    "__v": 0
  }
  ```
  
- `PUT` /api/thoughts
  
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
    "title": "Do gym every morning",
    "__v": 0
  }
  ```
  
- `POST` /api/thoughts/transferToPlan/:id

  Request
  
  `/api/thoughts/transferToPlan/63dab20a1bad4d34504b5c18`
  
  Respose
  ```
  {
    "_id": "63dab20a1bad4d34504b5c18",
    "title": "Do gym every morning",
    "text": "",
    "__v": 0
  }
  ``` 
  
</details>

### Plans

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

- `GET` /api/plans/:userId
- `GET` /api/plans/:id
- `POST` /api/plans/:userId
- `PATCH` /api/plans/:id
- `DELETE` /api/plans/:id

</details>
