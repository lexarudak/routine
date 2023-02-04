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
- `GET` /api/user/:id
- `POST` /api/user/registration
- `POST` /api/user/login
- `PUT` /api/user
- `DELETE` /api/user/:id

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
  
- `GET` /api/thought/:id
  
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
  
- `POST` /api/thought
    
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
  
- `PATCH` /api/thought
  
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
  
- `DELETE` /api/thought/:id

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
  
- `POST` /api/thought/transferToPlan/:id

  Request
  `/api/thought/transferToPlan/63dab20a1bad4d34504b5c18`
  
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
- `GET` /api/plan/:id
- `POST` /api/plan
- `PATCH` /api/plan/:id
- `DELETE` /api/plan/:id

</details>
