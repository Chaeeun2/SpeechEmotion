const path = require('path');

// server.js
const express = require('express');
const axios = require('axios');
const app = express();

// 정적 파일 경로 설정
app.use(express.static(path.join(__dirname, 'public3')));
app.use(express.json());

app.post('/sentiment-analysis', async (req, res) => {
    const { text } = req.body;
    const clientId = 'o48r3wdqh0';
    const clientSecret = 'S9HrxpX6GMo7Oja2KNBQ4w1LjZs4pKKyMa0Jlado';

    try {
        const response = await axios.post(
            'https://naveropenapi.apigw.ntruss.com/sentiment-analysis/v1/analyze',
            {
                content: text,
            },
            {
                headers: {
                    'X-NCP-APIGW-API-KEY-ID': clientId,
                    'X-NCP-APIGW-API-KEY': clientSecret,
                    'Content-Type': 'application/json',
                },
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error analyzing sentiment' });
    }
});

// 소켓 연결 시
io.on('connection', function (socket) {

    console.log("user connected");

    socket.on('value', function (value) {
        console.log(value);
        io.emit('value', value);
    });

    socket.on('value2', function (value2) {
        console.log(value2);
        io.emit('value2', value2);
    });
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});