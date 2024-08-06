const express = require("express");
const multer = require("multer");
const router = express.Router();
const path = require("path");
const { addNewRow, findProduct } = require("../database/product");
const {isAdmin} = require('../middleware/role.js')

router.use(isAdmin)

// upload foto
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
    const origin = file.originalname.split(".")
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

router.post("/product_photo", upload.single("item_file"), (req, res) => {
  console.log(req.file);
  res
    .status(201)
    .send({ msg: "Product has been successfully added into the database", newPath : req.file.filename });
});

router.post("/add_products", upload.none(), async (req, res) => {
  let { prodCat, prodName, prodPrice, photoPath } = req.body;

  prodPrice = Number(prodPrice)

  if (prodPrice < 1000 || (/[^\w\s]/).test(prodName)) {
    return res
      .status(400)
      .send({
        msg: "Prices have to be at least IDR 1,000.00, and product names can only contain letters, spaces, and numbers",
      });

  }

  let cat;
  if (prodCat == "food") {
    cat = 1;
  } else {
    cat = 2;
  }

  const added = await findProduct(prodName, prodCat);

  if (added) {
    res
      .status(400)
      .send({
        msg: "Another product with the same name and same category has already existed",
      });
    return;
  }

  await addNewRow(prodName, cat, prodPrice, photoPath);
  res
    .status(201)
    .send({ msg: "Product has been successfully added into the database." });
});

module.exports = router;
