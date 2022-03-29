import express from "express"
import cors from "cors"
const app = express()
import fs from 'fs';
const port = process.env.PORT || 4000
import swaggerUI from "swagger-ui-express" 

app.use(cors()) // habilita o cors-cross origin resource sharing
app.use(express.urlencoded({extended: true})) //habilita url com acentos
app.use(express.json())//habilita o parse do conteudo json
app.disable('x-powered-by') //remove o powered by por segurança
//import rotasCategorias from './routes/categorias.js'

//rota padrao
app.get('/', (req, res) => {
    res.status(200).json({
        mensagem:  'API 100% funcional', versao: '1.0.0'
    })
} )

//definindo a rota das categorias para
//app.use('/categorias', rotasCategorias)

app.use('/doc', swaggerUI.serve, swaggerUI.setup(JSON.parse(fs.
    readFileSync('./src/swagger/swagger_output.json'))))

app.listen(port, function(){
    console.log(`Servidor rodando na porta ${port}`)
})