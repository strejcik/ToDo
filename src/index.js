function ID() {
  return (
    "_" +
    Math.random()
      .toString(36)
      .substr(2, 9)
  );
}

function KanbanColumn(name, id=ID(), date = new Date()) {
  let self = this;
  this.name = name;
  this.id = id;
  this.date = date;
  this.cardId = id;
  this.element = createKanbanColumn();
  this.fetchLS();
  
  
  
  function randomColor(){
    var o = Math.round, r = Math.random, s = 255;
    return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + r().toFixed(1) + ')';
  }
  

  function randomDivBg(e) {
    e.style.backgroundColor = randomColor();
  }


  function createKanbanColumn() {
    let columnElement = document.createElement("div");
    columnElement.classList += "kanban-column";
    let columnEdit = document.createElement('textarea');
    columnEdit.classList += 'kanban-column-edit kanban-column-view';
    columnEdit.id = "kanban-column-view"
    let columnDate = document.createElement('h5');
    columnDate.classList += 'kanban-column-date';
    columnDate.innerHTML = self.date;
    let columnList = document.createElement("ul");
    columnList.classList += "kanban-column-list";
    let columnTitle = document.createElement("h1");
    columnTitle.classList += "kanban-column-title";
    columnTitle.innerHTML += self.name;
    let columnInput = document.createElement("input");
    columnInput.classList += "kanban-column-input";
    let columnDeleteBtn = document.createElement("button");
    columnDeleteBtn.classList += "kanban-column-delete";
    columnDeleteBtn.innerHTML += "X";
    let addCardBtn = document.createElement("button");
    addCardBtn.classList += "kanban-column-add-card";
    addCardBtn.innerHTML += "+";



    randomDivBg(columnElement);


    columnDeleteBtn.addEventListener("click", function() {
      self.removeColumnLS();
      self.removeColumn();
    });

    addCardBtn.addEventListener("click", function(e) {
      e.preventDefault();
      if(columnInput.value !== ""){
        let newId = ID();
        let cards = self.getCardsLS();
        cards.push({name:columnInput.value, id:newId});
        self.addCard(new KanbanCard(columnInput.value, newId, self.cardId));
        self.addCardsLS(cards);
        columnInput.value = '';
      }

    });

    columnInput.addEventListener('keyup', function(e) {
      e.preventDefault();
      if (e.keyCode === 13 && columnInput.value !== "") {
        let newId = ID();
        let cards = self.getCardsLS();
        cards.push({name:columnInput.value, id:newId});
        self.addCard(new KanbanCard(e.target.value, newId, self.cardId));
        self.addCardsLS(cards);
        e.target.value = "";
      }
    });


    columnTitle.onclick = function() {
      editStart();
    }



    function editStart() {
      columnEdit.value = columnTitle.innerHTML;

      columnEdit.onkeydown = function(event) {
        if (event.key === 'Enter') {
          this.blur();
        }
      };

      columnEdit.onblur = function() {
        editEnd();
      };

      columnTitle.replaceWith(columnEdit);
      columnEdit.focus();
    }

    function editEnd() {
      columnTitle.innerHTML = columnEdit.value;
      columnEdit.replaceWith(columnTitle);

      let columnsLS = self.getColumnsLS();

      columnsLS.forEach(e => {
        if(e.id === self.id) {
          e.name = columnTitle.innerHTML;
        }
      })

      localStorage.setItem('columns', JSON.stringify(columnsLS));
    }

    


    columnElement.append(columnDate);
    columnElement.append(columnTitle);
    columnElement.append(columnInput);
    columnElement.append(columnDeleteBtn);
    columnElement.append(addCardBtn);
    columnElement.append(columnList);

    return columnElement;
  }
}


KanbanColumn.prototype.getCardsLS = function () {
  return JSON.parse(localStorage.getItem(`cards${this.cardId}`))?JSON.parse(localStorage.getItem(`cards${this.cardId}`)): [];
}

KanbanColumn.prototype.getColumnsLS = function() {
  return JSON.parse(localStorage.getItem('columns'))?JSON.parse(localStorage.getItem('columns')): [];
}

KanbanColumn.prototype.removeColumnLS = function() {
  let columns = this.getColumnsLS();
  let temp = columns.filter(e => e.id !== this.id);
  
  localStorage.setItem('columns', JSON.stringify(temp));
  if(temp.length === 0) {
    localStorage.removeItem('columns');
  }
  localStorage.removeItem(`cards${this.cardId}`);
}

KanbanColumn.prototype.addCardsLS = function(cards) {
  localStorage.setItem(`cards${this.cardId}`, JSON.stringify(cards));
}

KanbanColumn.prototype.fetchLS = function () {
  const cards = JSON.parse(localStorage.getItem(`cards${this.cardId}`));
  let self = this;
  if(cards){
    cards.forEach(e => {
      self.addCard(new KanbanCard(e.name, e.id, this.cardId));
    });
  }
}

KanbanColumn.prototype.addCard = function(card) {
  this.element.children[5].append(card.element);
};

KanbanColumn.prototype.removeColumn = function() {
  this.element.remove();
};













function KanbanCard(desc, cardId=ID(), columnId=ID()) {
  let self = this;
  this.desc = desc;
  this.id = ID();
  this.cardId = cardId;
  this.columnId = columnId;

  this.element = createCardElement();

  function createCardElement() {
    let area = document.createElement('textarea');
    let kanbanCard = document.createElement("li");
    kanbanCard.classList += "kanban-card-element";
    let removeCardBtn = document.createElement("button");
    removeCardBtn.classList += "kanban-remove-btn";
    removeCardBtn.innerHTML += "X";
    let kanbanCardDesc = document.createElement("h3");
    kanbanCardDesc.classList += "kanban-card-desc kanban-card-view";
    kanbanCardDesc.id = "kanban-card-view";
    kanbanCardDesc.innerText += desc;

    removeCardBtn.addEventListener("click", function() {
      self.removeCardLS();
      self.removeCard();
    });


    kanbanCardDesc.onclick = function() {
      editStart();
    }

    function editStart() {
      area.className = 'kanban-card-edit';
      area.value = kanbanCardDesc.innerHTML;

      area.onkeydown = function(event) {
        if (event.key == 'Enter') {
          this.blur();
        }
      };

      area.onblur = function() {
        editEnd();
      };

    kanbanCardDesc.replaceWith(area);
      area.focus();
    }

    function editEnd() {
      kanbanCardDesc.innerHTML = area.value;
      area.replaceWith(kanbanCardDesc);

      let cardsLS = JSON.parse(localStorage.getItem(`cards${self.columnId}`));
      let cardLS = cardsLS.filter(e => e.id === self.cardId);
      cardLS[0].name = kanbanCardDesc.innerHTML;

      let newCardsLS = cardsLS.filter(e => e!== self.cardId);
      localStorage.setItem(`cards${self.columnId}`, JSON.stringify(newCardsLS));
    }

    kanbanCard.append(removeCardBtn);
    kanbanCard.append(kanbanCardDesc);
    return kanbanCard;
  }
}

KanbanCard.prototype.removeCard = function() {
  this.element.remove();
};

KanbanCard.prototype.removeCardLS = function() {
  let cardsLS = JSON.parse(localStorage.getItem(`cards${this.columnId}`))? JSON.parse(localStorage.getItem(`cards${this.columnId}`)) : [];
  cardsLS = cardsLS.filter(e => e.id !== this.cardId);
  localStorage.setItem(`cards${this.columnId}`, JSON.stringify(cardsLS));
  if(cardsLS.length === 0) localStorage.removeItem(`cards${this.columnId}`);

}















function KanbanTable(name) {
  let self = this;
  this.id = ID();
  this.name = name;
  this.element = createTableElement();
  this.fetchLS();


  function randomColor(){
    var o = Math.round, r = Math.random, s = 255;
    return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + r().toFixed(1) + ')';
  }
  
  function randomDivBg(e) {
    e["element"].style.backgroundColor = randomColor();
  }

  function currentDate() {
    let date = new Date();
    let dateString = ("0" + date.getDate()).slice(-2) + "-" + ("0"+(date.getMonth()+1)).slice(-2) + "-" +
    date.getFullYear() + " " + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2);
    return dateString;
  }

  function kanbanTableAdd() {
    let newId = ID();
    let kanbanColumn = new KanbanColumn(self.name, newId, currentDate());
    let temp = JSON.parse(localStorage.getItem('columns')) ? JSON.parse(localStorage.getItem('columns')) : [];
    temp.push({name: self.name, id: newId, date: currentDate()});
    self.addColumn(kanbanColumn);
    randomDivBg(kanbanColumn)
    localStorage.setItem('columns', JSON.stringify(temp));
  }


  function createTableElement() {
    let kanbanTable = document.createElement("div");
    kanbanTable.classList += "kanban-table-container";
    let kanbanTableInput = document.createElement("input");
    kanbanTableInput.classList += 'kanban-table-input';
    let kanbanTableSearchBtn = document.createElement('button');
    kanbanTableSearchBtn.classList += 'kanban-table-search-button';
    kanbanTableSearchBtn.innerHTML = '&#128269';
    let kanbanTableSearchInput = document.createElement('input');
    kanbanTableSearchInput.classList = 'kanban-table-input-search';
    let kanbanTableAddBtn = document.createElement("button");
    kanbanTableAddBtn.classList += "kanban-table-add-btn";
    kanbanTableAddBtn.innerHTML += "+";

    kanbanTableAddBtn.addEventListener("click", function(){
      if(kanbanTableInput.value !== '') {
        self.name = kanbanTableInput.value;
        kanbanTableAdd();
        kanbanTableInput.value= '';
      };

    });

    kanbanTableInput.addEventListener("keyup", function(e) {
      if (e.keyCode === 13 && e.target.value !=='') {
        self.name = e.target.value;
        kanbanTableAdd();
        e.target.value = "";
      }
    });



    kanbanTableSearchInput.addEventListener("keyup", function(e) {
      let filter = e.target.value.toUpperCase();
      let boardsTitles = document.getElementsByClassName('kanban-column-title');
      let a;
      for(let i = 0; i < boardsTitles.length; i++) {
        a = boardsTitles[i].innerText;
        if(a.toUpperCase().indexOf(filter) > -1) {
          boardsTitles[i].closest('.kanban-column').style.display = "";
        } else {
          boardsTitles[i].closest('.kanban-column').style.display = "none";
        }
      }
    });


    kanbanTable.append(kanbanTableSearchInput);
    kanbanTable.append(kanbanTableSearchBtn);
    kanbanTable.append(kanbanTableInput);
    kanbanTable.append(kanbanTableAddBtn);
    
    return kanbanTable;
  }
}

KanbanTable.prototype.fetchLS = function () {
  const columns = JSON.parse(localStorage.getItem('columns'))?JSON.parse(localStorage.getItem('columns')): [];
  let self = this;
  if(columns.length !== 0){
        columns.forEach(e => {
          self.addColumn(new KanbanColumn(e.name, e.id, e.date));
        });
      }
}

KanbanTable.prototype.addColumn = function(column) {
  this.element.append(column.element);
};
















function App(component) {
  this.element = createApp();

  function createApp() {
    let app = document.getElementById("app");
    app.append(component.element);

    return app;
  }
}

let kTable = new KanbanTable();

new App(kTable);
