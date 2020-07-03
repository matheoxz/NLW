//npm init -y
//npm install express

const express = require("express");
const server = express();
const db = require("./database/db");

//configurar pasta publica
server.use(express.static('public'));

//habilitar uso do body
server.use(express.urlencoded({ extended: true }))

//template engines
//npm install nunjucks
const nunjucks = require('nunjucks')
nunjucks.configure('src/views', {
    express: server,
    noCache: true
})


//configurar caminhos da aplicação
//página inicial
//req = requisição
//res = resposta
server.get("/", (req, res) => {
    return res.render('index.html')
})

server.get("/create-point", (req, res) => {
    return res.render('create-point.html')
})

server.post("/savepoint", (req, res) => {
    //inserir dados no bando de dados
    const query = `
    INSERT INTO places (
        image, name, adress, adress2, state, city, items
    ) VALUES (?, ?, ?, ?, ?, ?, ?);`
    const values = [
        req.body.image, 
        req.body.name, req.body.adress, 
        req.body.adress2, 
        req.body.state, 
        req.body.city, 
        req.body.items
    ]
    function afterInsertData(err) {
        if (err) {
            console.log(err);
            return res.send('Erro no cadastro')
        }
        console.log('Cadastrado com sucesso');
        console.log(this);

        return res.render('create-point.html', {saved: true});
    }

    db.run(query, values, afterInsertData)


})

server.get("/search", (req, res) => {
    //pegar os dados do bd
    const search = req.query.search;

    if(search == ''){
        //pesquisa vazia
        return res.render('search-results.html', { total: 0 })
    }



    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%';`, function (err, rows) {
        if (err) {
            return console.log(err);
        }

        const total = rows.length;

        return res.render('search-results.html', { places: rows, total: total })
    })
})

//ligar o servidor
server.listen(3000)

