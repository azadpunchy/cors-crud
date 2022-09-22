require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const STORE = require("./store");
const corsList = require("./coreList");

// methods crud
const storeCtrl = {
  create: async (req, res) => {
    try {
      const { id, data } = req.body;
      const alreadyExist = await STORE.findOne({ id });
      if (alreadyExist)
        return res.status(400).json({ msg: "This id already exists." });

      const newData = new STORE({ id, data });

      await newData.save();
      res.json({ msg: "Created a store item" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  list: async (req, res) => {
    try {
      const list = await STORE.find();
      res.json(list);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  update: async (req, res) => {
    try {
      const { data } = req.body;
      await STORE.findByIdAndUpdate({ _id: req.params.id }, { data });
      res.json({ msg: "updated store data" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  delete: async (req, res) => {
    try {
      await STORE.findByIdAndDelete(req.params.id);
      res.json({ msg: "Deleted a store data" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

// allowed domains methods
const domain = {
  create: async (req, res) => {
    try {
      const { id, domain } = req.body;
      const alreadyExist = await corsList.findOne({ id });
      if (alreadyExist)
        return res.status(400).json({ msg: "This id already exists." });

      const newData = new corsList({ id, domain });

      await newData.save();
      res.json({ msg: "Created a corsList item" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  list: async (req, res) => {
    try {
      const list = await corsList.find();
      res.json(list);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  update: async (req, res) => {
    try {
      const { domain } = req.body;
      await corsList.findByIdAndUpdate({ _id: req.params.id }, { domain });
      res.json({ msg: "updated corsList data" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  delete: async (req, res) => {
    try {
      await corsList.findByIdAndDelete(req.params.id);
      res.json({ msg: "Deleted a corsList data" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

// dynamic cors options added
corsOptions = {
  origin: function (origin, callback) {
    var allowedDomain = false;
    corsList.find().then(
      (items) => {
        items.map(({ uri }) => {
          if (uri === origin) {
            return (allowedDomain = true);
          }
        });

        // after then
        if (allowedDomain) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      (err) => {
        if (err) console.log(err);
      }
    );
  },
};

const app = express();
app.use(cors(corsOptions));
const port = process.env.PORT;

app.use(express.json());

mongoose
  .connect(process.env.DB)
  .then(() => {
    console.log("dob conn ok");
  })
  .catch((err) => {
    console.log(err);
  });

// routes
// store routes
app.route("/").post(storeCtrl.create).get(storeCtrl.list);
app.route("/:id").put(storeCtrl.update).delete(storeCtrl.delete);

// allowed domains routes
app.route("/allowedDomain").post(domain.create).get(domain.list);
app.route("/allowedDomain/:id").put(domain.update).delete(domain.delete);

app.listen(port, () => {
  console.log(`app is listining on port: ${port}`);
});
