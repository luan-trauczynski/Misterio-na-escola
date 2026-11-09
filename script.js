const screens = {
  start: document.getElementById("start-screen"),
  game: document.getElementById("game-screen"),
  win: document.getElementById("win-screen"),
  over: document.getElementById("gameover-screen")
};

const story = {
  alerta: {
    title: "Escola em perigo",
    icon: "🤔",
    question: "Você se encontra com um amigo na troca de aulas. Ele te chama para matar a próxima aula no banheiro, você vai?",
    context: "O fato de ter uma aula de química te assusta.",
    answers: [
      {
        text: "Xingar a professora e ser expulso do colégio",
        next: "gameover",
        damage: 100
      },
      {
        text: "Ir para o banheiro. Não ligo para química",
        next: "Banheiro",
        damage: 0
      },
      {
        text: "Recusar e ter uma aula de química cansativa",
        next: "aula",
        damage: 35
      }
    ]
  },

  Banheiro: {
    title: "Começa o suspense",
    icon: "👱‍♀️",
    question: "No banheiro, seu amigo fala para vocês brincarem de invocar a loira do banheiro, você invoca?",
    context: "Talvez o mito seja mais assustador do que você imagina",
    answers: [
      {
        text: "Invoco e tento bater nela igual um maluco",
        next: "gameover",
        damage: 100
      },
      {
        text: "Percebo que esse cara é doido e volto para a sala estudar química",
        next: "aula",
        damage: 35
      },
      {
        text: "Deixa o seu amigo invocar, afinal, ele que deu a ideia",
        next: "amigo",
        damage: 0
      }
    ]
  },

  aula: {
    title: "Que barulho foi esse?",
    icon: "🧪",
    question: "Durante a aula, você sente como se o seu cérebro estivesse pesado, você está muito cansado e perde sanidade mental por isso. Até que começa a ouvir barulhos estranhos vindo do banheiro, alguém passa correndo pelo corredor gritando 'invocaram a loira do banheiro!!'",
    context: "Seu amigo vinha falando dessa tal loira",
    answers: [
      {
        text: "Se juntar com a multidão desesperada e fugir da escola, deixando seu amigo para trás",
        next: "win",
        damage: 0
      },
      {
        text: "Vai atrás de seu amigo, que está sendo atacado pela loira",
        next: "amigo",
        damage: 10
      },
      {
        text: "Baixar o arquivo anexado para descobrir do que se trata.",
        next: "gameover",
        damage: 100
      }
    ]
  },

  amigo: {
    title: "Perigo à vista",
    icon: "👱‍♀️",
    question: "Seu amigo está sendo atacado pela loira do banheiro, o que você faz?",
    context: "Uma decisão que pode ser mortal",
    answers: [
      {
        text: "Empurrar a loira e ser atacado por ela",
        next: "gameover",
        damage: 100
      },
      {
        text: "Instalar a atualização pelo canal oficial.",
        next: "wifi",
        damage: 0
      },
      {
        text: "Pesquisar um instalador desconhecido.",
        next: "gameover",
        damage: 100
      }
    ]
  },

  wifi: {
    title: "Rede em perigo",
    icon: "📶",
    question: "Você está em um café e precisa acessar sua conta bancária. A rede Wi-Fi pública não tem senha. Qual é a melhor opção?",
    context: "Redes públicas podem ser inseguras.",
    answers: [
      {
        text: "Usar a rede aberta normalmente.",
        next: "gameover",
        damage: 100
      },
      {
        text: "Esperar por uma conexão confiável ou usar os dados móveis.",
        next: "backup",
        damage: 0
      },
      {
        text: "Conectar em qualquer rede disponível.",
        next: "gameover",
        damage: 100
      }
    ]
  },

  backup: {
    title: "Plano de recuperação",
    icon: "💾",
    question: "Um arquivo importante foi apagado após uma falha no computador. O que poderia ajudar a recuperá-lo?",
    context: "Cópias de segurança protegem seus arquivos contra perdas e ataques.",
    answers: [
      {
        text: "Ter backups atualizados em local seguro.",
        next: "finalcheck",
        damage: 0
      },
      {
        text: "Guardar a única cópia na área de trabalho.",
        next: "gameover",
        damage: 100
      },
      {
        text: "Desativar as proteções do computador.",
        next: "gameover",
        damage: 100
      }
    ]
  },

  finalcheck: {
    title: "Último protocolo",
    icon: "🛡️",
    question: "Qual conjunto de ações ajuda a manter um sistema protegido?",
    context: "Chegou a hora de reunir tudo o que você aprendeu!",
    answers: [
      {
        text: "Senhas únicas, autenticação em duas etapas, atualizações e atenção aos links.",
        next: "win",
        damage: 0
      },
      {
        text: "Compartilhar senhas e desativar o antivírus.",
        next: "gameover",
        damage: 100
      },
      {
        text: "Usar a mesma senha em todas as contas.",
        next: "gameover",
        damage: 100
      }
    ]
  }
};

let current = "alerta";
let history = [];
let integrity = 100;
let answered = 0;

function showScreen(name) {
  Object.values(screens).forEach(screen => {
    screen.classList.add("hidden");
  });

  screens[name].classList.remove("hidden");
}

function startGame() {
  current = "alerta";
  history = [];
  integrity = 100;
  answered = 0;

  renderQuestion();
  showScreen("game");
}

function renderQuestion() {
  const node = story[current];

  document.getElementById("chapter-title").textContent = node.title;
  document.getElementById("question-icon").textContent = node.icon;
  document.getElementById("question").textContent = node.question;
  document.getElementById("context").textContent = node.context;

  document.getElementById("level-chip").textContent =
    `FASE ${String(answered + 1).padStart(2, "0")}`;

  document.getElementById("integrity").textContent =
    `${integrity}%`;

  document.getElementById("integrity-bar").style.width =
    `${integrity}%`;

  document.getElementById("progress-bar").style.width =
    `${Math.min(100, answered * 16 + 10)}%`;

  const answers = document.getElementById("answers");
  answers.innerHTML = "";

  node.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.className = "answer-btn";

    const letter = document.createElement("span");
    letter.className = "letter";
    letter.textContent = String.fromCharCode(65 + index);

    button.append(letter, document.createTextNode(answer.text));

    button.addEventListener("click", () => {
      chooseAnswer(answer);
    });

    answers.appendChild(button);
  });
}

function chooseAnswer(answer) {
  history.push({
    current: current,
    integrity: integrity,
    answered: answered
  });

  integrity = Math.max(0, integrity - answer.damage);
  answered++;

  if (answer.next === "gameover" || integrity <= 0) {
    document.getElementById("integrity").textContent = "0%";
    document.getElementById("integrity-bar").style.width = "0%";

    showScreen("over");
    return;
  }

  if (answer.next === "win") {
    showScreen("win");
    return;
  }

  current = answer.next;
  renderQuestion();
}

function goBack() {
  if (history.length === 0) return;

  const previous = history.pop();

  current = previous.current;
  integrity = previous.integrity;
  answered = previous.answered;

  renderQuestion();
}

document.getElementById("start-btn")
  .addEventListener("click", startGame);

document.getElementById("restart-win")
  .addEventListener("click", startGame);

document.getElementById("restart-loss")
  .addEventListener("click", startGame);

document.getElementById("back-btn")
  .addEventListener("click", goBack);