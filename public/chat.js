const socketIo = io()
const messageText = document.querySelector('#messageText')
const buttonSend = document.querySelector('#buttonSend')
const messageBox = document.querySelector('#messageBox')	

const templateMessageSender = message => {
	const temporaryDiv = document.createElement('div')
	temporaryDiv.innerHTML = `
	<div class="me uk-grid-small uk-flex-bottom uk-flex-right uk-text-right" uk-grid>
		<div class="uk-width-auto">
			<div class="uk-card uk-card-body uk-card-small uk-card-primary uk-border-rounded">
				<p class="uk-margin-remove" id="text"></p>
			</div>
		</div>
			<div class="uk-width-auto">
		</div>
	</div>
	`

	const fragment = document.createDocumentFragment()
	fragment.append(temporaryDiv)
	fragment.querySelector('#text').textContent = message

	return temporaryDiv
}

const templateMessageReceive = (message, id) => {
	const temporaryDiv = document.createElement('div')
	temporaryDiv.innerHTML = `
	<div class="uk-card-body uk-padding-small">
		<div class="guest uk-grid-small uk-flex-bottom uk-flex-left" uk-grid>
			<div class="uk-width-auto">
				<div class="uk-card uk-card-body uk-card-small uk-card-default uk-border-rounded">
					<p class="uk-margin-remove" id="messageId:${id}"></p>
				</div>
			</div>
		</div>
	</div>
	`

	const fragment = document.createDocumentFragment()
	fragment.append(temporaryDiv)
	fragment.getElementById(`messageId:${id}`).textContent = message

	return temporaryDiv
}

messageBox.append(templateMessageReceive('Welcome!', 0))

socketIo.on('receiveMessage', message => {
	messageBox.append(templateMessageReceive(message.content, message.messageId))
})

buttonSend.addEventListener('click', () => {
	if (messageText.value.length > 0) {
		socketIo.emit('sendMessage', {
			content: messageText.value
		})
		messageBox.append(templateMessageSender(messageText.value))
		messageText.value = ''
	}
})
