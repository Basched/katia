const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')
const ServerHttp = require('./src/http')


const flowPrincipal = addKeyword(['hola']).addAnswer('🙌 Hola bienvenido a este *Chatbot*')


const PORT = process.env.PORT ?? 3001

const serverHttp = new ServerHttp(PORT)

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowPrincipal])
    const adapterProvider = createProvider(BaileysProvider)

    await createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    serverHttp.initialization()

    QRPortalWeb()
}

main()
