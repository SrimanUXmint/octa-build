const express = require('express');
const path = require('path');


const app = express();

// ✅ Middleware

app.use(express.static(path.join(__dirname))); 




// ✅ Routes
app.get((req, res) => {
   
    res.sendFile(path.join(__dirname, 'login.html'));
});



// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
