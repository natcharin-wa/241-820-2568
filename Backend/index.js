// ทำการ import http module เพื่อสร้าง server
const http = require('http');
const host = 'localhost';
const port = 8000;

// กำหนดค่าเริ่มต้นของ server เมื่อเปิดใช้งาน เว็บผ่านเบราว์เซอร์ ที่ localhost:8000

const requireListener = function(reg, res) {
    res.writeHead(200);
    res.end('My First Server!');
}

//run server
const server = http.createServer(requireListener);
server.listen(port, host, () => {
    console.log(`Server is running at http://${host}:${port}`);
});