const express = require('express')
const helmet = require('helmet')
const path = require('path')
const {
	v4: uuidv4
} = require('uuid')
const http = require('http')

const app = express()
const server = http.createServer(app)
const io = require('socket.io')(server)

const port = process.env.PORT || 8000
const build = 1

app.use(helmet.dnsPrefetchControl())
app.use(helmet.hidePoweredBy())
app.use(helmet.permittedCrossDomainPolicies())
app.use(helmet.xssFilter())

app.set('trust proxy', 1)

app.use(express.static(path.join(__dirname, 'public')))

io.on('connection', socket => {
	console.log('[!] Join')

	socket.on('disconnect', () => {
		console.log('[!] Disconnect')
	})

	socket.on('sendMessage', message => {
		const {
			content
		} = message
		const messageId = uuidv4()
		console.log('[+] sendMessage:', content, messageId)

		socket.broadcast.emit('receiveMessage', {
			content,
			messageId
		})
	})
})

server.listen(port, () => console.log(`App listening at http://localhost:${port}`))
