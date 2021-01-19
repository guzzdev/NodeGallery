# NodeGallery
 

A small app that helps gathering family photos on my server.

|Techs used         |What for                       |
|-------------------|-------------------------------|
|Mongoose           |`MongoDBDatabase`              |
|EJS                |`Template language`            |
|express-ejs-layouts|`EJS Layouts`                  |
|Express            |`Node Server`                  |
|Multer             |`File uploading`               |

## How to :
---
- Install package with yarn or npm
- `npm install`
- Create .env file; required :
  - **PORT** => The port the app uses 
  - **MONGO_URI** => The MongoDB uri
- `npm run prod`
## Example:
---

.env
```
PORT=3000
MONGO_URI=mongodb://localhost:27017/imagesDB
SESSION_SECRET=fdekfnekorngrejb
```

## Env :
---
- Node v14.15.2
- NPM 6.14.9
---


*Author : Louis OLIVE*
