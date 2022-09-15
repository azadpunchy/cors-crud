require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const STORE = require("./store");

// methods
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

const port = process.env.PORT;
const app = express();
app.use(cors());
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
app.route("/").post(storeCtrl.create).get(storeCtrl.list);

app.route("/:id").put(storeCtrl.update).delete(storeCtrl.delete);

app.listen(port, () => {
  console.log(`app is listining on port: ${port}`);
});
