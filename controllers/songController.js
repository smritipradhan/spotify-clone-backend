const { validate, Song } = require("././../models/Songs");

// ------------------- GET ---------------------

module.exports.song_get = (req, res) => {
  res.status(200).json({
    message: "GET Route",
  });
};

// ------------------- POST ---------------------

module.exports.song_post = async (req, res) => {
  const error = validate(req.body);
  console.log(error);
  if (error) {
    res.status(400).send({
      message: "Error",
    });
  } else {
    const song = await Song(req.body).save();

    res.status(200).send({
      message: "Song Created Successfully !!",
      data: song,
    });
  }
};

// ------------------- PUT ---------------------

module.exports.song_put = (req, res) => {
  res.status(200).json({
    message: "PUT Route",
  });
};

// ------------------- DELETE ---------------------

module.exports.song_delete = (req, res) => {
  res.status(200).json({
    message: "DELETE Route",
  });
};
