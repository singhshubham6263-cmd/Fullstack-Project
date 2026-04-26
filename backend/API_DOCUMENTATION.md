# Translation API Documentation

Base URL: `http://localhost:5000/api`

---

## Authentication

### 1. Register User
Create a new user account.

- **URL:** `/auth/register`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Success Response:** `201 Created`
  ```json
  {
    "success": true,
    "token": "jwt_token_string",
    "user": {
      "id": "123",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
  ```

### 2. Login User
Authenticate an existing user.

- **URL:** `/auth/login`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Success Response:** `200 OK` (Same as Register)

---

## Translation

### 1. Translate Text
Translates text and applies phrase intelligence (replaces idioms/slang before translation).

- **URL:** `/translate`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer <token>` (Optional)
- **Body:**
  ```json
  {
    "text": "It is raining cats and dogs",
    "sourceLanguage": "en",
    "targetLanguage": "es",
    "sourceRegion": "US"
  }
  ```
- **Success Response:** `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "originalText": "It is raining cats and dogs",
      "processedText": "It is raining heavily",
      "translatedText": "[ES Translation] It is raining heavily",
      "phrasesReplaced": [
        {
          "originalPhrase": "raining cats and dogs",
          "genericMeaning": "raining heavily"
        }
      ],
      "historyId": "mongodb_id_string"
    }
  }
  ```

### 2. Get Translation History
Fetch logged-in user's past translations.

- **URL:** `/translate/history`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer <token>` (Required)
- **Success Response:** `200 OK`
  ```json
  {
    "success": true,
    "count": 1,
    "data": [
      {
        "_id": "abc",
        "originalText": "Hello",
        "translatedText": "Hola",
        "sourceLanguage": "en",
        "targetLanguage": "es"
      }
    ]
  }
  ```

---

## Phrases (Intelligence Engine)

### 1. Get Phrases
Fetch regional idioms/phrases.

- **URL:** `/phrases`
- **Method:** `GET`
- **Query Params:** `?language=en&region=US`
- **Success Response:** `200 OK`
  ```json
  {
    "success": true,
    "count": 1,
    "data": [
      {
        "originalPhrase": "raining cats and dogs",
        "genericMeaning": "raining heavily",
        "language": "en",
        "region": "US"
      }
    ]
  }
  ```

### 2. Add Phrase
Add a new regional idiom.

- **URL:** `/phrases`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "originalPhrase": "piece of cake",
    "genericMeaning": "very easy",
    "language": "en",
    "region": "US"
  }
  ```
- **Success Response:** `201 Created`
