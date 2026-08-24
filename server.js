// Khai báo thư viện express
const express = require('express');
const app = express();
const port = 3000; 


app.use(express.json());


app.get('/', (req, res) => {
  res.send('Xin chào! Đây là server backend cơ bản của bạn.');
});

app.get('/api/users', (req, res) => {
  const users = [
    { id: 1, name: 'Nguyễn Văn A' },
    { id: 2, name: 'Trần Thị B' }
  ];
  res.json(users); 
});

app.post('/api/users', (req, res) => {
  const newUserData = req.body; 
  
  res.json({
    message: 'Đã nhận được dữ liệu thành công!',
    dataReceived: newUserData
  });
});

app.listen(port, () => {
  console.log(`🚀 Server đang chạy tại địa chỉ: http://localhost:${port}`);
});