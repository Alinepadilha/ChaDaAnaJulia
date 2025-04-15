const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

let convidados = [];

app.post('/api/cadastrar', (req, res) => {
  const { nome, whatsapp } = req.body;
  const convidado = { nome, whatsapp, status: 'Não Confirmado', familiares: [] };
  convidados.push(convidado);
  res.status(200).send({ message: 'Convidado cadastrado com sucesso!' });
});

app.get('/api/convidados', (req, res) => {
  res.status(200).json(convidados);
});

app.post('/api/confirmar', (req, res) => {
  const { nome, presenca, familia, nomesFamiliares } = req.body;
  let convidado = convidados.find(c => c.nome === nome);
  if (!convidado) {
    return res.status(404).send({ message: 'Convidado não encontrado!' });
  }
  convidado.status = `Confirmado: ${presenca === 'sim' ? 'Sim' : 'Não'}, Família: ${familia === 'sim' ? 'Sim' : 'Não'}`;
  convidado.familiares = nomesFamiliares ? nomesFamiliares.split(',').map(n => n.trim()) : [];
  res.status(200).send({ message: 'Status atualizado com sucesso!' });
});

app.delete('/api/convidado/:nome', (req, res) => {
  const nome = decodeURIComponent(req.params.nome);
  convidados = convidados.filter(c => c.nome !== nome);
  res.status(200).send({ message: 'Convidado excluído com sucesso!' });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
