class Note {
  constructor(title, content, date, id, isLocal) {
    this.title = title;
    this.content = content;
    this.values = JSON.parse(localStorage.getItem("notes")) || [];
    this.id = id || this.createID();
    this.date = date || false;

    this.isLocal = isLocal;
    this.parentNav = document.querySelector(".navbar .container");
    this.textarea = document.getElementById("note");
    this.titleEl = document.getElementById("title");
    this.dateEl = document.querySelector(".notes .note .date");
  }
  createNavEl() {
    if (this.title == "" || this.content == "") return;
    this.date == false ? (this.date = this.getDate()) : this.date;
    // create elements
    let div = document.createElement("div");
    let h2 = document.createElement("h2");
    let p = document.createElement("p");
    let span = document.createElement("span");
    let h2Content = document.createTextNode(this.title);
    let pContent = document.createTextNode(this.content);
    let spanContent = document.createTextNode(this.date);

    if (this.content.split("").length > 15) {
      pContent = document.createTextNode(`${this.content.slice(0, 15)}...`);
    }

    // classes
    div.classList.add("note");
    span.classList.add("date");

    // append
    h2.append(h2Content);
    p.append(pContent);
    span.append(spanContent);

    div.append(h2);
    div.append(p);
    div.append(span);

    this.parentNav.append(div);

    // add as property

    this.noteEl = div;
    this.h2 = h2;
    this.p = p;
    this.spanDate = span;

    // add to local storge
    if (!this.isLocal) {
      this.addToLocalStorage();
    }

    // function
    this.displayToBody();
    this.edit();
    this.remove();

    // empty

    this.titleEl.value = "";
    this.textarea.value = "";
  }
  displayToBody() {
    setInterval(() => {
      let notes = document.querySelectorAll(".note");
      notes.forEach((e) => e.classList.remove("active"));
      this.noteEl.onclick = () => {
        this.noteEl.classList.add("active");
        this.titleEl.value = this.title;
        this.textarea.value = this.content;
        this.dateEl.innerHTML = this.date;
      };
    });
  }
  addToLocalStorage() {
    this.values.push({
      title: this.title,
      content: this.content,
      date: this.date,
      id: this.id,
    });

    localStorage.setItem("notes", JSON.stringify(this.values));
  }
  getDate() {
    let date = new Date().toString();
    let resutl = [
      date.match(/^\w{3}/g)[0],
      date.match(/\w+ \d+ \d+/g)[0],
      date.match(/\w+:\w+/g)[0],
    ];

    return `${resutl[0]}, ${resutl[1]} at ${resutl[2]}`;
  }
  createID() {
    let result = [];
    let values = this.values.map((e) => e.id);

    for (let i = 0; i < 5; i++) {
      let randomNumber = Math.floor(Math.random() * 10);
      result.push(randomNumber);
    }

    if (values.includes(result)) {
      this.createID();
    }

    return result.join("");
  }
  remove() {
    setInterval(() => {
      this.noteEl.ondblclick = () => {
        if (!confirm("are u sure ?")) return;

        this.noteEl.remove();
        this.removeFromLocalStorage();
      };
    });
  }
  removeFromLocalStorage() {
    this.values = JSON.parse(localStorage.getItem("notes"));

    for (let i = 0; i < this.values.length; i++) {
      if (this.values[i].id === this.id) {
        this.values.splice(i, 1);
      }
    }

    localStorage.setItem("notes", JSON.stringify(this.values));
  }
  edit() {
    setInterval(() => {
      window.addEventListener("keydown", (e) => {
        if (e.ctrlKey && e.key === "s") {
          e.preventDefault();

          this.title = this.titleEl.value;
          this.content = this.textarea.value;
          this.date = this.getDate();

          this.h2.innerHTML = this.title;
          this.p.innerHTML =
            this.content.split("").length > 15
              ? `${this.content.slice(0, 15)}...`
              : this.content;
          this.spanDate.innerHTML = this.date;

          this.editLocalStorage();
        }
      });
    });
  }
  editLocalStorage() {
    this.values = JSON.parse(localStorage.getItem("notes"));

    for (let i = 0; i < this.values.length; i++) {
      if (this.values[i].id === this.id) {
        this.values[i].title = this.title;
        this.values[i].date = this.date;
        this.values[i].content = this.content;
      }
    }

    localStorage.setItem("notes", JSON.stringify(this.values));
  }
}

class Diary {
  constructor() {
    this.notes = [];
    this.addButton = document.getElementById("add");
    this.textarea = document.getElementById("note");
    this.titleEl = document.getElementById("title");

    this.values = JSON.parse(localStorage.getItem("notes"));
  }
  create() {
    setInterval(() => {
      this.addButton.onclick = () => {
        let note = new Note(this.titleEl.value, this.textarea.value);

        note.createNavEl();
        this.notes.push(note);
      };

      window.addEventListener("keyup", (e) => {
        if (e.ctrlKey && e.keyCode === 13) {
          this.addButton.click();
        }
      });
    });
  }
  showLocalStorage() {
    for (let value of this.values) {
      let note = new Note(
        value.title,
        value.content,
        value.date,
        value.id,
        true
      );

      note.createNavEl();
    }
  }
}

let diary = new Diary();

diary.create();
diary.showLocalStorage();

let icon = document.querySelector(".icon");
let navbar = document.querySelector(".navbar");
let overlay = document.querySelector(".overlay");
let check = true;

icon.onclick = () => {
  if (check) {
    navbar.classList.add("active");
    overlay.style.display = "block";
    check = false;
  } else {
    navbar.classList.remove("active");
    overlay.style.display = "none";
    check = true;
  }
};

setInterval(() => {
  let scrollbar = document.querySelector(".scrollbar");
  let navbar = document.querySelector(".navbar");
}, 1000);
