const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')
const ServerHttp = require('./src/http')
const PORT = process.env.PORT ?? 3001


const flowPrincipal = addKeyword('hola')
    .addAnswer('Buenas bienvenido a mi ecommerce')
    .addAnswer('¿Como puedo ayudarte el dia de hoy?')

const serverHttp = new ServerHttp(PORT)

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowPrincipal])
    const adapterProvider = createProvider(BaileysProvider)

    const bot = await createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    serverHttp.initialization()

// 
// Incoming Messages
//     
adapterProvider.on('message', (payload) => {
  console.log('incoming_msg:', payload.body)})

// Outgoing Messages
// 
//     
bot.on('send_message', (payload) => { 
  console.log('outgoing_msg:', payload.answer)}) 



}

main()
