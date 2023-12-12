const express = require('express')
const cors = require('cors')
const {join} = require('path')
const {createReadStream} = require('fs')
// const app = express()
// app.use(cors())

/**
 * express endpoints & routes for QR code flexible entry point*
 * */
class ServerHttp {
  app; 
  port; 

  constructor(_port = 4000) {
    this.port = _port
  }


/**
 * QR code controller
**/
qrCtrl = (_, res) => {
  const pathQrImage = join(process.cwd(), 'bot.qr.png');
  const fileStream = createReadStream(pathQrImage); 
  res.writeHead(200, { "Content-Type": "image/png" });
  fileStream.pipe(res);
}


/**
 * ChatWoot Events controller
**/

chatwootCtrl = (_, res) => {
  res.send('ok')
}




/**
 * Start HTTP Server
 */
  initialization = () => {
    this.app = express()
    this.app.use(cors())

    this.app.post('/chatwoot', this.chatwootCtrl)
    this.app.get('/scan-qr', this.qrCtrl)


    this.app.listen(this.port, () => {

      console.log(``) 
      console.log(`http://localhost:${this.port}/scan-qr`)
      console.log(``)
      
    })


}
}

module.exports = ServerHttp
