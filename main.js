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
    
    async setBienvenida() {
        try {
            let response = await fetch("http://localhost:8000/api/generico/?type=MBie");
            let data = await response.json();
            let message_bot = {'name': 'bot', 'message': data[0].text}
            this.messages.push(message_bot)
    
        } catch {
            let message_bot = {'name': 'bot', 'message': 'Mensaje de error'}
            this.messages.push(message_bot)  
            console.log("Algo paso, no se pudo resolver...");
        }
    }


    display() {
        const {openButton, chatBox, sendButton} = this.args;

        console.log('display chatbot');
        console.log('lent messages', this.messages.length);
        this.updateChatText(chatBox);

        openButton.addEventListener('click', () => this.toggleState(chatBox))

        sendButton.addEventListener('click', () => this.onSendButton(chatBox))

        const node = chatBox.querySelector('input');

        node.addEventListener("keyup", ({key}) => {
            if (key === "Enter") {
                this.onSendButton(chatBox)
            }
        });
    }

    toggleState(chatbox) {
        this.state = !this.state;

        // show or hides the box
        if(this.state) {
            chatbox.classList.add('chatbox--active')
        } else {
            chatbox.classList.remove('chatbox--active')
        }
    }

    onSendButton(chatbox) {
        var textField = chatbox.querySelector('input');
        let text1 = textField.value
        
        if (text1 === "") {
            return;
        }

        let msg1 = { name: "user", message: text1 }
        this.messages.push(msg1);
        // TODO
        fetch('http://localhost:8000/api/messages/type/', {
            method: 'POST',
            body: JSON.stringify({ message: text1 }),
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json'
            },
          })
          .then(resp => resp.json())
          .then(resp => {
            console.log(resp['response'])
            let msg2 = { name: "bot", message: resp['response'] };
            this.messages.push(msg2);
            this.updateChatText(chatbox)
            textField.value = ''
            // console.log(this.messages);

        }).catch((error) => {
            console.error('Error:', error);
            this.updateChatText(chatbox)
            textField.value = ''
          });
    }

    updateChatText(chatbox) {
        let html = '';
        console.log('updatetext')
        console.log(this.messages.length);
        console.log(this.messages[0]);
        if (this.messages.length === 0) {
            console.log('asd')
        }

        console.log(this.messages);

        this.messages.slice().reverse().forEach(function(item, index) {
            console.log('item',item);
            if (item.name === "bot"){
                html += '<div class="messages__item messages__item--visitor">' + item.message + '</div>'
            }
            else{
                html += '<div class="messages__item messages__item--operator">' + item.message + '</div>'
            }
          });

        const chatmessage = chatbox.querySelector('.chatbox__messages');
        chatmessage.innerHTML = html;
    }
}

const chatbox = new Chatbox();
console.log('set Bienvida');
chatbox.setBienvenida();
console.log('dspasldas');
chatbox.display();
