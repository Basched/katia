const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())


class ServerHttp {
  app; 
  port; 

  constructor(_port = 4000) {
    this.port = _port
  }


  initialization = () => {
    this.app = express()
    this.app.use(cors())

    this.app.listen(this.port, () => console.log(`🦮 http://localhost:${this.port}`)) 


}
}

module.exports = ServerHttp
