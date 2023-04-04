const dotaenv = require('dotenv').config();
const axios = require('axios');
const fs=  require('fs');
const path=  require('path');
const formdata=  require('form-data')
const OpenAIApi = process.env.OPENAI_API_KEY;
const filePath = path.join(__dirname,'audio.mp3')
const model = 'whisper-1';
const formData = new formdata();
formData.append('model',model)
formData.append('file',fs.createReadStream(filePath))
// axios.post('https://api.openai.com/v1/audio/transcriptions',formData,{
//     headers:{
//         Authorization:`Bearer ${OpenAIApi}`,
//         "Content-Type":`multipart/form-data; boundary=${formData._boundary}`
//     }
// })
// .then((response=>console.log(response)))
// .catch(err=>console.log(err))


const a  = fs.createReadStream(filePath)
console.log(a);