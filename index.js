const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
let bancosFinanciamento = require('./bancosFinanciamento.json')
let bancosEmprestimos = require('./bancosEmprestimos.json')
const app = express()
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended : false}))
app.use(express.json())
app.use(cors())

const PORT = process.env.PORT || 2022

app.listen(PORT, () => {
  console.log(`Executando API na porta: ` + PORT)
})

app.get('/', (req,res)=>{
  res.send('Bem-vindo a API da Moneta Web!')
})
app.get('/financiamento', (req,res) =>{
  return res.json(bancosFinanciamento)
})

//Mostrando os dados da API
app.get('/emprestimo',(req, res) => 
  res.json(bancosEmprestimos)
)

//Procurando os dados por meio do ID
app.get('/api/:id',(req, res) => {
  const userId = req.params.id
  const user = bancosEmprestimos.find(user => Number(user.id) === Number(userId))
  if (!user) {
    return res.json('Banco não encontrado!')
  }
  res.json(user)
})

//Enviando dados para API
app.route('/api').post((req, res) => {
  const lastId = bancosEmprestimos[bancosEmprestimos.length -1].id
  bancosEmprestimos.push({
    id: lastId + 1,
    name: req.body.name,
    avatar: req.body.avatar,
    desc: req.body.desc
  })
  res.json('Banco adicionado com sucesso!')
})
//Deletando os dados por meio do ID
app.route('/api/:id').delete((req, res) => {
  const userId = req.params.id
  bancosEmprestimos = bancosEmprestimos.filter(user => Number(user.id) !== Number(userId))
  res.json('Banco deletado com sucesso!')
})

//Atualizando dados da API
app.route('/api/:id').patch((req, res) => {
  const userId = req.params.id
 
  let user = bancosEmprestimos.find(user => Number(user.id) === Number(userId))
  if (!user) {
    return res.json('Banco não encontrado!')
  }

  const updatedUser = {
    ...user,
    name: req.body.name,
    avatar: req.body.avatar,
    city: req.body.city
  }

  bancosEmprestimos = bancosEmprestimos.map(user => {
    if (Number(user.id) === Number(userId)) {
      user = updatedUser
    }
    return user
  })

  res.json(`Atualização do banco !`)
})

