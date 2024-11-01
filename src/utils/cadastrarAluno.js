const alunoForm = document.getElementById("alunoForm");
const nomeAluno = document.getElementById("nomeAluno");
const sobrenomeAluno = document.getElementById("sobrenomeAluno");
const emailAluno = document.getElementById("emailAluno");
const numeroAluno = document.getElementById("numeroAluno");
const senhaAluno = document.getElementById("senhaAluno");
const confirmarSenhaAluno = document.getElementById("confirmarSenhaAluno");
const generoAluno = document.getElementById("generoAluno");

alunoForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const alunoData = {
        nome: nomeAluno.value,
        sobrenome: sobrenomeAluno.value,
        email: emailAluno.value,
        numero: numeroAluno.value,
        senha: senhaAluno.value,
        genero: generoAluno.value
    };

    fetch('/addAluno', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(alunoData)
    })
    .then(response => response.text())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
});