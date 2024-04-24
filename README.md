# NodeGallery

A small app that helps gathering family photos on my server.

| Techs used          | What for          |
| ------------------- | ----------------- |
| Mongoose            | MongoDB           |
| EJS                 | Template language |
| express-ejs-layouts | EJS Layouts       |
| Express             | Node Server       |
| Multer              | File uploading    |

## How to :

---

- Install package with yarn or npm
- `npm install`
- Create .env file; required :
  - **PORT** => The port the app uses
  - **MONGO_URI** => The MongoDB uri
  - **SESSION_SECRET** => Session secret string
- `npm run prod`
## Example:

---

.env

```
PORT=3000
MONGO_URI=mongodb://localhost:27017/imagesDB
SESSION_SECRET=arandomkey
```
#
