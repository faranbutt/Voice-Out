const express = require("express");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const path = require("path");
const { Readable } = require('stream');

const router = express.Router();
const upload = multer({
  fileFilter: function(req, file, cb) {
    if (!file.originalname.match(/\.(mp3)$/)) {
      return cb(new Error("Only mp3 files are allowed!"));
    }
    cb(null, true);
  }
});

router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "index.html"));
});

async function transcribe(buffer) {
    const formData = new FormData();
    const readable = Readable.from(buffer);
    formData.append('audio', readable);
    formData.append('model', 'whisper-1'); // Add the model parameter to formData
  
    const response = await axios.post(
      'https://api.openai.com/v1/audio/transcriptions',
      formData,
      {
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        params: {
          language: 'en',
          format: 'json',
          temperature: 1,
        }
      }
    );
    
    return response.data;
  }
  
router.post("/", upload.any('file'), (req, res) => {
    const audio_file = req.files[0];
    const buffer = audio_file.buffer;
    buffer.name = audio_file.originalname;
    
    transcribe(buffer)
        .then(data => {
            console.log(data);
            res.send({ 
                type: "POST", 
                transcription: data.text,
                audioFileName: buffer.name
            });
        })
        .catch(error => {
            console.log(error.response.data);
            res.send({ type: "POST", message: error.message });
        });
});

module.exports = router;
