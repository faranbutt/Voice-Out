const express = require("express");
const multer = require("multer");
const { Configuration, OpenAIApi } = require("openai");


const router = express.Router();
const upload = multer();

const configuration = new Configuration({
    apiKey: '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',
});

async function transcribe(buffer) {
    const openai = new OpenAIApi(configuration);
    const response = await openai.createTranscription(
        buffer, // The audio file to transcribe.
        "whisper-1", // The model to use for transcription.
        undefined, // The prompt to use for transcription.
        'json', // The format of the transcription.
        1, // Temperature
        'en' // Language
    )
    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `Correct the grammar in ${response.data.text}`,
      });
    return completion;
}

router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "index.html"));
});

router.post("/", upload.any('file'), (req, res) => {
    audio_file = req.files[0];
    buffer = audio_file.buffer;
    buffer.name = audio_file.originalname;
    const response = transcribe(buffer);
    response.then((data) => {
        // const text = data.data.text;
        res.send({ 
            type: "POST", 
            transcription: data.data.choices[0].text,
            audioFileName: buffer.name
        })
    })
});

module.exports = router;

