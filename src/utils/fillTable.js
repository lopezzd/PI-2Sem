document.getElementById('loadUsers').addEventListener('click', function() {
  document.getElementById('userList').innerHTML = '';
  document.getElementById('errorMessage').style.display = 'none';
  const userList = document.getElementById('userList');
  const errorMessage = document.getElementById('errorMessage');

  const loadingMessage = document.createElement('li');
  loadingMessage.classList.add('loading');
  loadingMessage.textContent = 'Carregando alunos...';
  userList.appendChild(loadingMessage);

  fetch('http://localhost:3000/alunos')
    .then(response => response.json())
    .then(data => {
      userList.innerHTML = ''; 

      data.forEach(aluno => {
        const userItem = document.createElement('li');
        userItem.classList.add('user');
        userItem.innerHTML = `
          <span>${aluno.ID_ALUNO}</span>
          <span>${aluno.DATA_MATRICULA}</span>
          <span>${aluno.SEXO_ALUNO}</span>
          <span>${aluno.DATA_MATRICULA}</span>
        `;
        userList.appendChild(userItem);
      });
    })
    .catch(error => {
      userList.innerHTML = '';
      errorMessage.style.display = 'block';
      errorMessage.textContent = 'Erro ao carregar alunos. Tente novamente mais tarde.';
    });
});