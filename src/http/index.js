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

  constructor(_port = 4000){
    this.port = _port
  }

/**
 * QR code controller
**/
qrCtrl = (_, res) => {
  const pathQrImage = join(process.cwd(), `bot.qr.png`);
  const fileStream = createReadStream(pathQrImage); 
  res.writeHead(200, { "Content-Type": "image/png" });
  fileStream.pipe(res);
}


/**
 * ChatWoot Events controller
**/

chatwootCtrl = async (req, res) => {
  const body = req.body;
  const attachments = body?.attachments
  const bot = req.bot;
  try {

      const mapperAttributes = body?.changed_attributes?.map((a) => Object.keys(a)).flat(2)

      /**
       * This function is in charge of adding or removing the number to the blacklist
       * in order to pause chatbot writting to allow for a human agent to responses instead
       */
      if (body?.event === 'conversation_updated' && mapperAttributes.includes('assignee_id')) {
          const phone = body?.meta?.sender?.phone_number.replace('+', '')
          const idAssigned = body?.changed_attributes[0]?.assignee_id?.current_value ?? null
  
          if(idAssigned){
              bot.dynamicBlacklist.add(phone)
          }else{
              bot.dynamicBlacklist.remove(phone)
          }
          res.send('ok')
          return
      }

      /**
       * The part that is in charge of determining if a message is sent to the clients whatsapp
       */
      const checkIfMessage = body?.private == false && body?.event == "message_created" && body?.message_type === "outgoing" && body?.conversation?.channel.includes("Channel::Api")
      if (checkIfMessage) {
          const phone = body.conversation?.meta?.sender?.phone_number.replace('+', '')
          const content = body?.content ?? '';

          const file = attachments?.length ? attachments[0] : null;
          if (file) {
              console.log(`Attached file.`, file.data_url)
              await bot.providerClass.sendMedia(
                  `${phone}@c.us`,
                  file.data_url,
                  content,
              );
              res.send('ok')
              return
          }



                /**
                 * esto envia un mensaje de texto al ws
                 */
                await bot.providerClass.sendMessage(
                  `${phone}`,
                  content,
                  {}
              );

              res.send('ok');
              return;
             
          }

          res.send('ok')
      } catch (error) {
          console.log(error)
          return res.status(405).send('Error')
      }
  }

/**
 * Start HTTP Server
 */
initialization = (bot = undefined) => {
  if(!bot){
      throw new Error('DEBES_DE_PASAR_BOT')
  }
  this.app = express()
  this.app.use(cors())
  this.app.use(express.json())
  this.app.use(express.static('public'))

  this.app.use((req, _, next) => {
      req.bot = bot;
      next()
  })

  this.app.post(`/chatwoot`, this.chatwootCtrl)
  this.app.get('/scan-qr',this.qrCtrl)

  this.app.listen(this.port, () => {
      console.log(``)
      console.log(`🦮 http://localhost:${this.port}/scan-qr`)
      console.log(``)
  })
}

}

module.exports = ServerHttp
