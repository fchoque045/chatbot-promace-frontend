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
        fetch("http://localhost:8000/api/generico/?type=MBie")
            .then(response => response.json())
            .then(data =>{
                let message_bot = {'name': 'bot', 'message': data[0].text}
                this.messages.push(message_bot)
                this.display();
            })
            .catch((err) => console.log(err));
    }

    display() {
        const {openButton, chatBox, sendButton} = this.args;

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

    async onSendButton(chatbox) {
        let textField = chatbox.querySelector('input');
        let text1 = textField.value
        
        if (text1 === "") {
            return;
        }

        let msg1 = { name: "user", message: text1 }
        this.messages.push(msg1); 
        let data = {}      
        try {
            data = await fecthPregunta(text1);
            console.log('sendButton',data)
            this.display_message(data);
            textField.value = ''
            this.updateChatText(chatbox)
        } catch (error){
            console.log(error)
            console.log("Algo paso, no se pudo resolver...");
        }
    }
            

    updateChatText(chatbox) {
        let html = '';

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

    display_message(data){
        console.log('displat messge',data)
        data.forEach(element => {
            let message = element.text
            if (message === undefined){
                console.log(message)
                message = element.descripcion;
            }
            let msg2 = { 'name': "bot", 'message': message };

            this.messages.push(msg2);
        });        
    }

}

async function fecthPregunta(text){
    const response = await fetch("http://localhost:8000/api/pregunta/", {
        method: "POST",
        body: JSON.stringify({'text':text}),
        headers: { "Content-type": "application/json; charset=UTF-8" },
    })
    if (response.status == 404){
        const response_cat = await fetch("http://localhost:8000/api/categoria")
        const data = await response_cat.json();
        return data
    }else {
        const data = await response.json();        
        return data
    }
}

const chatbox = new Chatbox();
chatbox.setBienvenida();