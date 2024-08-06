const express = require("express");
const router = express.Router();
const { findProductById } = require("../database/product.js");
const { isAdmin } = require("../middleware/role.js");
const multer = require("multer");
const path = require("path");

router.use(isAdmin);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(
      null,
      path.join(
        __dirname,
        "..",
        "..",
        "frontend",
        "public",
        "uploads",
        "products"
      )
    );
  },
  filename: (req, file, cb) => {
    const origin = file.originalname.split(".");
    cb(null, origin[0] + "-" + Date.now() + "." + origin[1]);
  },
});

const upload = multer({
  storage: storage,
});

router.use(express.static(__dirname));
router.use(
  "/uploads",
  express.static(
    path.join(
      __dirname,
      "..",
      "..",
      "frontend",
      "public",
      "uploads",
      "products"
    )
  )
);

router.get("/prod/:id", async (req, res) => {
  const prod = await findProductById(req.params.id);

  if (prod === null) {
    res.send("There is no product with that ID");
    return;
  }

  res.send(prod);
});

router.post("/photo-change/:id", upload.single("newPic"), async (req, res) => {
    if (!req.file) {
      res.status(401).send({ msg: "Please upload an image" });
      return;
    }

    const prod = await findProductById(req.params.id);
    prod.photo = req.file.filename
    await prod.save();

    console.log(prod)
    res.status(201).end();
  }
);

const findId = async (req, res, next) => {
  if (!req.body) {
    res.status(401).send({ msg: "Please fill in a value" });
    return;
  }

  const prod = await findProductById(req.body.id);

  if (prod === null) {
    res.send("There is no product with that ID");
    return;
  }
  res.locals.prod = prod;
  res.locals.body = req.body;
  next();
};

router.use(findId);

router.post("/name-change", async (req, res) => {
  const prod = res.locals.prod;
  prod.name = res.locals.body.newName;

  await prod.save();

  res.status(201).end();
});

router.post("/category-change", async (req, res) => {
  const prod = res.locals.prod;
  console.log(req.body);
  prod.category = res.locals.body.newCategory === "food" ? 1 : 2;

  await prod.save();

  res.status(201).end();
});

router.delete("/delete", async (req, res) => {
  const prod = res.locals.prod;
  await prod.destroy();

  res.status(204).end();
});

module.exports = router;
