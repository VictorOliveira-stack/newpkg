const express = require('express')
const app = express()
const handlebars = require('express-handlebars')
const port = 8000
const path = require('path')
//const mysql2 = require('mysql2')

const pool = require('./db/conn.js')//banco de dados

//engine
app.engine('handlebars', handlebars.engine({
    defaultLayout: 'main', 
    extname: '.handlebars',
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    partialsDir: path.join(__dirname, 'views', 'partials')
}))
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views'))

//middleware parser
app.use(
    express.urlencoded({
        extended: true
    })
)
app.use(express.json())// Middleware para parsear o corpo das requisições JSON

app.use(express.static(path.join(__dirname, 'public')))

//rotass
app.get('/', (re, res)=>{
    res.render('home.handlebars')
})

app.post('/insert', (req, res)=>{
    const name = req.body.name
    const descriçao = req.body.descriçao
    //const idade = req.body.idade

    const sql = `INSERT INTO clientes (name, descriçao) VALUES (?,?)`
    const values = [name, descriçao]

    pool.query(sql, values, function(err){
        if(err){
            console.log(err)
            return res.status(500).send('Erro ao inserir dados.')
        }
        console.log('postou')
        res.redirect('/')
    })
})

//ver tudo
app.post('/vertudo', (req,res)=>{
    const sql = 'SELECT *FROM clientes'

    pool.query(sql, function (err, data){
        if(err){
            console.log(err)
            return
        }
        const resultadoCliente = data

        res.render('vertudo.handlebars', {resultadoCliente})
    })
})

//pesquisar

app.post('/lookingfor', (req, res)=>{
    //const name = req.body.search
    const searchName = req.body.search

    //const sql = `SELECT *FROM books WHERE LOWER name LIKE '${name}'`
    const sql = `SELECT *FROM clientes WHERE LOWER (name) LIKE ?`
    const values = [`%${searchName.toLowerCase()}%`]// Converte a pesquisa para minúsculas e adiciona curingas

    pool.query(sql,values, function(err,data){
        if(err){
            console.log(err)
            return
        }

        const resultadoNomeCliente = data
        res.render('search.handlebars', {resultadoNomeCliente})
    })
})

//delete
app.post('/deletar', (req,res)=>{
    const id = req.body.id

    const sql = 'DELETE FROM clientes WHERE  id = ?'
    const nomeColuna = [id]
    

    pool.query(sql, nomeColuna, function(err){
        if(err){
            console.log(err)
            return
        }
        res.redirect('/')
    })

})

app.get('/editar', (req,res)=>{
    const id = req.query.id
    const sql = 'SELECT *FROM clientes WHERE id = ?'
    const id2 = [id]

    pool.query(sql,id2, function(err, data){
        if(err){
            console.log(err)
            return
        }
        const sql2 = data[0]
        res.render('editar.handlebars', {sql2})
    })
})

app.post('/update', (req,res)=>{
    const id = req.body.id
    const name = req.body.name
    const descriçao = req.body.descriçao
    //const idade = req.body.idade
    const sql = `UPDATE clientes SET  name = ? , descriçao = ?    WHERE id = ? `
    const values = [name, descriçao, id]
    pool.query(sql, values, function(err){
         if(err){
            console.log(err)
            return
        }
        
        res.redirect('/')
    })
})


//conecção server
app.listen(port, ()=>{
    console.log(`rodando ${port}`)
})


