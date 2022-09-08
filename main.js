class Chatbox {
    constructor() {
        this.args = {
            openButton: document.querySelector('.chatbox__button'),
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button')
        }

        this.state = false;
        this.messages = [];
    }

    setBienvenida() {
        fetch("https://chatbot-promace.herokuapp.com/api/generico/?type=MBie")
            .then(response => response.json())
            .then(data => {
                const message_bot = { 'name': 'bot', 'message': data[0].text }
                // this.updateChatText(message_bot)
                // this.messages.push(message_bot)
                this.display(message_bot);
            })
            .catch((err) => console.log(err));
    }

    display(message) {
        const { openButton, chatBox, sendButton } = this.args;

        this.updateChatText(chatBox, message);

        openButton.addEventListener('click', () => this.toggleState(chatBox))

        sendButton.addEventListener('click', () => this.sendMessage(chatBox));

        const node = chatBox.querySelector('input');

        node.addEventListener("keyup", ({ key }) => {
            if (key === "Enter") {
                this.sendMessage(chatBox);
            }
        });
    }

    sendMessage(chatbox) {
        let textField = chatbox.querySelector('input');
        let text1 = textField.value
        this.onSendButton(text1);
    }

    toggleState(chatbox) {
        this.state = !this.state;

        // show or hides the box
        if (this.state) {
            chatbox.classList.add('chatbox--active')
        } else {
            chatbox.classList.remove('chatbox--active')
        }
    }

    async onSendButton(message) {
        if (!message) {
            return;
        }

        console.log(message);
        let msg1 = { name: "user", message };
        this.updateChatText(this.args.chatBox, msg1);
        // this.messages.push(msg1);
        // let data = {}
        try {
            const data = await fecthPregunta(msg1.message);
            console.log('sendButton', data)
            const message = this.getMessageUser(data);
            // textField.value = ''
            this.updateChatText(this.args.chatBox, message)
        } catch (error) {
            console.log(error)
            console.log("Algo paso, no se pudo resolver...");
        }
    }

    createMessageContent(children, clazz) {
        const messageItem = document.createElement('div');
        messageItem.classList.add('messages__container');
        if (clazz === 'operator') {
            messageItem.classList.add('message__contaner--operator');
        }
        children.forEach(c => messageItem.appendChild(c));
        return messageItem;
    }

    createMessageItem(clazz, content) {
        const messageElement = document.createElement('div');
        messageElement.textContent = content;
        messageElement.classList.add('messages__item');
        messageElement.classList.add(`messages__item--${clazz}`);
        return messageElement;
    }

    updateChatText(chatbox, item) {
        let messageChildren;
        console.log('item', item);

        const messageClass = item.name === 'bot' ? 'visitor' : 'operator';

        if (item.choices) {
            messageChildren = item.choices.map(c => {
                const item = this.createMessageItem(messageClass, c);
                item.classList.add('message__item--choice');


                item.addEventListener('click', () => this.onSendButton(c))
                // TODO add event listener
                return item;
            });
        } else {

            messageChildren = [this.createMessageItem(messageClass, item.message)];
            // html += `<div class="messages__item messages__item--${messageClass}">${item.message}</div>`;
        }
        //   });

        const chatmessage = chatbox.querySelector('.chatbox__messages');
        chatmessage.appendChild(this.createMessageContent(messageChildren, messageClass));
        // chatmessage.innerHTML = html;
    }

    getMessageUser(data) {
        if (data.choices) {
            const message = { name: 'bot', choices: data.choices.map(c => c.descripcion) };
            // this.messages.push(message);
            return message;
        }

        let message_final = 'Estas son las siguientes opciones \n';
        data.forEach(element => {
            let message = element.text;
            console.log(message);
            if (!message) {
                message = element.descripcion;
                console.log(message);
            }

            message_final += message + '\n';
        });
        return { 'name': "bot", 'message': message_final };
        // this.messages.push(msg2);
    }

    displayMessage() {
        console.log('displat messge', data)
        let message_final = ''
        data.forEach(element => {
            let message = element.text + ' \n ';
            console.log(message)
            if (message === undefined) {
                message = element.descripcion + ' \n ';
            }
            message_final += message;
        });
        let msg2 = { 'name': "bot", 'message': message_final };
        this.messages.push(msg2);
    }

}

async function fecthPregunta(text) {
    // const response = await fetch("https://apimocha.com/chat-bot/pregunta/", {
    //     method: "POST",
    //     body: JSON.stringify({ 'text': text }),
    //     headers: { "Content-type": "application/json; charset=UTF-8" },
    // })
    // if (response.status == 404) {
    const response_cat = await fetch("https://chatbot-promace.herokuapp.com/api/categoria")
    const data = await response_cat.json();
    return { choices: data }
    // } else {
    //     const data = await response.json();
    //     return data
    // }
}

const chatbox = new Chatbox();
chatbox.setBienvenida();