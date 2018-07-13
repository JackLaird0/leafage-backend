# ![leaf](./public/assets/leaf.png) Leafage Backend ![leaf](./public/assets/leaf.png)
## B.Y.O.B - Build Your Own Backend project
---
## Synopsis

We learned how to build a backend server but learned a lot more about ourselves along the way. This project is built using Node, Express, Knex, PSQL, and Nightmare. We focused on building a backend with data we scraped from [Fine Gardening's](https://www.finegardening.com/) amazing [Plant Guide](https://www.finegardening.com/plant-guide). Feel free to visit our front end and get a token to use our API [here]().

---
# Endpoints
## GET

### GET Zones
    GET /api/v1/zones
### Response
  ![zones](public/assets/get-zones.png)

### GET a specific Zone
    GET /api/v1/zones/:id
### Response
  ![zone](public/assets/get-zone.png)

---
### GET Plants
    GET /api/v1/plants
### Response
  ![plants](public/assets/get-plants.png)
### GET a specific Plant
    GET /api/v1/plants/:id
### Response
  ![plant](public/assets/get-plant.png)

---

## POST 

### POST to plants
    POST /api/v1/plants

---

## PUT

### PUT to a specific Plant
    PUT /api/v1/plants/:id

### PUT to a specific Zone
    PUT /api/v1/zones/:id

---

## Technologies

### Node - Express - Knex - PSQL - Nightmare

---

## Contributers 

[Jack Laird](https://github.com/JackLaird0) -
[Cameron Buscher](https://github.com/yayfiber)