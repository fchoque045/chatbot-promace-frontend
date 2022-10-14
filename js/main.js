import {
  fetchSaludoBienvenida,
  fetchSaludoPresentacion,
  fetchCategorias,
  fetchSubcategoriasByCategoria,
  fetchSubcategoriasByIdSubcategoria,
  fetchQuestionByIdSubcategoria,
  fetchQuestion,
} from "./services.js";

// const baseUrl = "http://127.0.0.1:8000/api";
// const baseUrl = 'https://chatbot-promace.herokuapp.com/api'

class Chatbox {
  constructor() {
    this.args = {
      openButton: document.querySelector(".chatbox__button"),
      chatBox: document.querySelector(".chatbox__support"),
      sendButton: document.querySelector(".send__button"),
    };

    this.hello = true;
    this.state = false;
    // this.messages = [];
  }

  async setSaludoBienvenida() {
    const msj = await fetchSaludoBienvenida();
    try {
      const message_bot = { name: "bot", message: msj.mensaje };
      this.display(message_bot);
    } catch (error) {
      console.log("Error de servidor");
      const message_bot = { name: "bot", message: "Error" };
      this.display(message_bot);
    }
  }

  async setSaludoPresentacion(name) {
    const msj = await fetchSaludoPresentacion();
    const categories = await fetchCategorias();
    try {
      const message_bot = {
        name: "bot",
        message: msj.texto.replace("{name}", name),
        choices: categories,
        type: "category",
      };
      this.display(message_bot);
      this.hello = false;
    } catch (error) {
      console.log("Error de servidor");
      const message_bot = { name: "bot", message: "Error" };
      this.display(message_bot);
    }
  }

  display(message) {
    const { openButton, chatBox, sendButton } = this.args;

    this.updateChatText(chatBox, message);

    openButton.addEventListener("click", () => this.toggleState(chatBox));

    sendButton.addEventListener("click", () => this.sendMessage(chatBox));

    const node = chatBox.querySelector("input");

    node.addEventListener("keyup", ({ key }) => {
      if (key === "Enter") {
        this.sendMessage(chatBox);
      }
    });
  }

  sendMessage(chatbox) {
    let textField = chatbox.querySelector("input");
    let text1 = textField.value;
    this.onSendButton(text1);
    textField.value = "";
  }

  toggleState(chatbox) {
    this.state = !this.state;

    // show or hides the box
    if (this.state) {
      chatbox.classList.add("chatbox--active");
      chatbox.classList.remove("oculto");
    } else {
      chatbox.classList.remove("chatbox--active");
      chatbox.classList.add("oculto");
    }
  }

  async onSendButton(message, type = null, id = null) {
    if (!message) {
      return;
    }

    let msg1 = { name: "user", message };
    this.updateChatText(this.args.chatBox, msg1);

    if (this.hello) {
      this.setSaludoPresentacion(message);
      return;
    }

    if (type == "category") {
      try {
        const data = await fetchSubcategoriasByCategoria(id);
        const message = this.getMessageUser({ choices: data });
        message.type = "subcategory";
        this.updateChatText(this.args.chatBox, message);
      } catch (error) {
        console.log(error);
        console.log("Algo paso, no se pudo resolver...");
      }
    }

    if (type == "subcategory") {
      try {
        const data1 = await fetchSubcategoriasByIdSubcategoria(id);
        const message1 = this.getMessageUser({ choices: data1 });
        message1.type = "subcategory";
        this.updateChatText(this.args.chatBox, message1);
        const data2 = await fetchQuestionByIdSubcategoria(id);
        const message2 = this.getMessageUser({ choices: data2 });
        message2.type = "question";
        this.updateChatText(this.args.chatBox, message2);
      } catch (error) {
        console.log(error);
        console.log("Algo paso, no se pudo resolver...");
      }
    }

    if (type == "question") {
      try {
        const data = await fetchQuestion(id);
        const message = this.getMessageUser(data);
        message.type = "question";
        this.updateChatText(this.args.chatBox, message);
      } catch (error) {
        console.log(error);
        console.log("Algo paso, no se pudo resolver...");
      }
    }
  }

  createMessageContent(children, clazz) {
    // console('messageContent', clazz)
    const messageItem = document.createElement("div");
    messageItem.classList.add("messages__container");
    if (clazz === "operator") {
      messageItem.classList.add("message__contaner--operator");
    }
    children.forEach((c) => messageItem.appendChild(c));
    return messageItem;
  }

  createMessageItem(clazz, content) {
    console.log(content);
    const messageElement = document.createElement("div");
    messageElement.innerHTML = content;
    messageElement.classList.add("messages__item");
    messageElement.classList.add(`messages__item--${clazz}`);
    return messageElement;
  }

  updateChatText(chatbox, item) {
    let messageChildren;
    const messageClass = item.name === "bot" ? "visitor" : "operator";
    console.log(item);
    if (item.choices) {
      messageChildren = this.createMessageItem(messageClass, item.message);
      item.choices.map((c) => {
        console.log(c);
        const item_choice = document.createElement("div");
        item_choice.textContent = c.descripcion;
        item_choice.classList.add("message__item--choice");
        item_choice.addEventListener("click", () => {
          let text = c.descripcion ? c.descripcion : c.pregunta;
          console.log(text);
          this.onSendButton(text, item.type, c.id);
        });
        // TODO add event listener
        //message_box.appendChild(item_choice)
        messageChildren.appendChild(item_choice);
      });

      messageChildren = [messageChildren];

      // messageChildren.appendChild(messageChoice)
    } else {
      messageChildren = [this.createMessageItem(messageClass, item.message)];
      // messageChildren = this.createMessageItem(messageClass, item.message);
      // html += `<div class="messages__item messages__item--${messageClass}">${item.message}</div>`;
    }
    //   });

    const chatmessage = chatbox.querySelector(".chatbox__messages");
    chatmessage.appendChild(
      this.createMessageContent(messageChildren, messageClass)
    );
    chatmessage.scrollTop = chatmessage.scrollHeight;
    // chatmessage.innerHTML = html;
  }

  getMessageUser(data) {
    if (data.choices) {
      const message = {
        name: "bot",
        // choices: data.choices.map((c) =>
        //   c.descripcion ? c.descripcion : c.text
        // ),
        choices: data.choices,
        type: data.type,
      };
      // this.messages.push(message);
      return message;
    }

    return { name: "bot", message: data.respuesta, type: data.type };

    // let message_final = "";
    // data.forEach((element) => {
    //   let message = element.text;
    //   if (!message) {
    //     message = element.descripcion;
    //     console.log(message);
    //   }

    //   message_final += message + "\n";
    // });

    // this.messages.push(msg2);
  }

  // displayMessage() {
  //     console.log('displat messge', data)
  //     let message_final = ''
  //     data.forEach(element => {
  //         let message = element.text + ' \n ';
  //         console.log(message)
  //         if (message === undefined) {
  //             message = element.descripcion + ' \n ';
  //         }
  //         message_final += message;
  //     });
  //     let msg2 = { 'name': "bot", 'message': message_final };
  //     this.messages.push(msg2);
  // }
}

// async function fecthPregunta(text) {
//   const response1 = await fetch(`${baseUrl}/pregunta/?id=${text}`);
//   if (response1.status == 404) {
//     const response = await fetch(`${baseUrl}/pregunta/`, {
//       method: "POST",
//       body: JSON.stringify({ text: text }),
//       headers: { "Content-type": "application/json; charset=UTF-8" },
//     });
//     if (response.status == 404) {
//       const response_cat = await fetch(`${baseUrl}/categoria/`);
//       const data = await response_cat.json();
//       return { choices: data };
//     } else {
//       const data = await response.json();
//       return { choices: data };
//       // return data
//     }
//   } else {
//     const data = await response1.json();
//     return [{ text: data[0].respuesta }];
//   }
// }

const chatbox = new Chatbox();
chatbox.setSaludoBienvenida();
