import {
  fetchSaludoBienvenida,
  fetchGenerico,
  fetchCategorias,
  fetchSubcategoriasByCategoria,
  fetchSubcategoriasByIdSubcategoria,
  fetchQuestionByIdSubcategoria,
  fetchQuestion,
  fetchQuestionByKeyword,
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
  }

  async setSaludoBienvenida() {
    const msj = await fetchSaludoBienvenida();
    try {
      const message_bot = { name: "bot", message: msj.mensaje };
      this.updateChatText(this.args.chatBox, message_bot);
    } catch (error) {
      console.log("Error de servidor");
      const message_bot = { name: "bot", message: "Error" };
      this.updateChatText(this.args.chatBox, message_bot);
    }
  }

  async setSaludoPresentacion(name) {
    const msj = await fetchGenerico("MPre");
    const categories = await fetchCategorias();
    categories.forEach((c) => (c.type = "category"));
    try {
      const message_bot = {
        name: "bot",
        message: msj.texto.replace("{name}", name),
        choices: categories,
      };
      this.updateChatText(this.args.chatBox, message_bot);
      this.hello = false;
    } catch (error) {
      console.log("Error de servidor");
      const message_bot = { name: "bot", message: "Error" };
      this.updateChatText(this.args.chatBox, message_bot);
    }
  }

  initializationButtons() {
    const { openButton, chatBox, sendButton } = this.args;
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
    console.log(text1);
    this.onSendButton(text1);
    textField.value = "";
  }

  toggleState(chatbox) {
    this.state = !this.state;
    console.log("open", this.state);

    // show or hides the box
    if (this.state) {
      chatbox.classList.add("chatbox--active");
      chatbox.classList.remove("oculto");
    } else {
      chatbox.classList.remove("chatbox--active");
      chatbox.classList.add("oculto");
    }
  }

  async onSendButton(message) {
    if (!message) {
      return;
    }

    let msg1 = { name: "user", message };
    this.updateChatText(this.args.chatBox, msg1);

    if (this.hello) {
      this.setSaludoPresentacion(message);
      return;
    }

    try {
      const data = await fetchQuestionByKeyword(message);
      data.forEach((p) => (p.type = "question"));
      const message_bot = this.getMessageUser({ choices: data });
      message_bot.message = `Preguntas referidas a la consulta`;
      this.updateChatText(this.args.chatBox, message_bot);
    } catch (error) {
      console.log(error);
      console.log("Algo paso, no se pudo resolver...");
    }
  }

  async onClickChoice(message, type, id) {
    const { chatBox } = this.args;
    let msg1 = { name: "user", message };
    this.updateChatText(chatBox, msg1);

    console.log(message, type);
    if (type == "category") {
      try {
        const data = await fetchSubcategoriasByCategoria(id);
        data.forEach((s) => (s.type = "subcategory"));
        const message_bot = this.getMessageUser({ choices: data });
        message_bot.message = `Dudas respecto a ${message}`;
        console.log(message);
        this.updateChatText(this.args.chatBox, message_bot);
      } catch (error) {
        console.log(error);
        console.log("Algo paso, no se pudo resolver...");
      }
    }

    if (type == "subcategory") {
      try {
        const data1 = await fetchSubcategoriasByIdSubcategoria(id);
        data1.forEach((s) => (s.type = "subcategory"));
        const data2 = await fetchQuestionByIdSubcategoria(id);
        data2.forEach((p) => (p.type = "question"));
        const data = data1.concat(data2);
        const message_bot = this.getMessageUser({ choices: data });
        message_bot.message = `Selecciona una de las opciones`;
        this.updateChatText(this.args.chatBox, message_bot);
      } catch (error) {
        console.log(error);
        console.log("Algo paso, no se pudo resolver...");
      }
    }

    if (type == "question") {
      try {
        const data = await fetchQuestion(id);
        data.type = "question";
        const message_bot = this.getMessageUser(data);
        this.updateChatText(this.args.chatBox, message_bot);
      } catch (error) {
        console.log(error);
        console.log("Algo paso, no se pudo resolver...");
      }
    }
  }

  createMessageContent(children, clazz) {
    const messageItem = document.createElement("div");
    messageItem.classList.add("messages__container");
    if (clazz === "operator") {
      messageItem.classList.add("message__contaner--operator");
    }
    children.forEach((c) => messageItem.appendChild(c));
    return messageItem;
  }

  createMessageItem(clazz, content) {
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
        const item_choice = document.createElement("div");
        item_choice.textContent = c.descripcion ? c.descripcion : c.pregunta;
        item_choice.classList.add("message__item--choice");
        item_choice.addEventListener("click", () => {
          this.onClickChoice(item_choice.textContent, c.type, c.id);
        });
        messageChildren.appendChild(item_choice);
      });

      messageChildren = [messageChildren];
    } else {
      messageChildren = [this.createMessageItem(messageClass, item.message)];
    }

    const chatmessage = chatbox.querySelector(".chatbox__messages");
    chatmessage.appendChild(
      this.createMessageContent(messageChildren, messageClass)
    );
    chatmessage.scrollTop = chatmessage.scrollHeight;
  }

  getMessageUser(data) {
    if (data.choices) {
      const message = {
        name: "bot",
        choices: data.choices,
      };
      return message;
    }

    return { name: "bot", message: data.respuesta, type: data.type };
  }
}

const chatbox = new Chatbox();
chatbox.setSaludoBienvenida();
chatbox.initializationButtons();
