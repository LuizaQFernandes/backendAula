import express from "express";
import res from "express/lib/response";
import { connectToDatabase } from "../util/mongodb.js";
import { check, validationResulte } from 'express-validator'

const router = express.Router();
const nomeCollection = "categorias";
const { db, ObjectId } = await connectToDatabase();

/**
 * Validações das Categorias
 */
const validaCategorias = [
  check("nome")
  .not().isEmpty().trim()
  .withMessage('O nome é obrigatório')
  .isLength({min:3}).withMessage("Nome muito curto, mínimo de 3 caracteres")
  .isLength({max:100}).withMessage("Nome muito longo, máximo de 100 caracteres")
  .isAlpha('pt-br', {ignore: ' '}).withMessage("O nome deve conter apenas texto"),

  check('status')
  .default(true).not().isString().withMessage("O status não pode ser texto")
  .not().isInt().withMessage("O status não pode ser número")
]


/**
 * GET / categorias
 */
router.get("/", async (req, res) => {
  try {
    db.collection(nomeCollection)
      .find({})
      .toArray((err, docs) => {
        if (err) {
          res.status(400).json(err);
        } else {
          res.status(200).json(docs);
        }
      });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/**
 * GET /categorias/:id
 * Lista categorias através do id
 */
router.get(":/id", async (req, res) => {
  try {
    db.collection(nomeCollection)
      .find({ _id: { $eq: ObjectId(req.param.id) } })
      .toArray((err, docs) => {
        if (err) {
          res.status(400).json(err);
        } else {
          res.status(200).json(docs);
        }
      });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /categorias/nome/:nome
 * Lista categorias através do nomw
 */
 router.get(":/id", async(req, res) => {
  try{
    db.collection(nomeCollection).find(
      {"nome": {$regex: req.params.nome, $options: "i"}}).toArray(
        (err, docs) => {
          if(err){res.status(400).json(err);}
          else{res.status(200).json(docs)}
        }
    )
  } catch(err){
      res.status(500).json({"error": err.message})
    }
})

/**
 * POST /Categorias
 * Inclui uma nova categoria
 */
router.post("/", validaCategoria, 
  async(req, res) => {
    const errors = validationResult(req, res)
    if(!errors.isEmpty()){
      return res.status(400).json({
        errors: errors.array()
      })
    }
    /*verificando se a categoria ja existe
    const {nome} = req.body
    let categorias = await categorias*/
    else{
      await db.collection(nomeCollection)
        .insertOne(req.body)
        .then(result => res.status(201).send(result))
        .catch(err => res.status(400).json(err))
    }

  }
)

/**
 * DELETE /Categorias
 * Apaga uma categoria pelo id
 */
router.delete("_id", async(req, res) => {
  await db.collections(nomeCollection)
  .deleteOne({"id_": {$eq: ObjectId(req.params.id)}})
  .then(result=> res.status(202).send(result))
  .catch(err => res.status(400).json(err))
})

/**
 * PUT /categorias
 * altera os dados da categoria
 */
 router.put("/", validaCategoria, async(req, res) => {
  const errors = validationResult(req)
  
  if(!errors.isEmpty()) {
      return res.status(400).json(({
          errors: errors.array()
      }))
  } else {
      const categoriaDados = req.body
      await db.collection(nomeCollection)
      .updateOne({"_id": {$eq: ObjectId(req.body._id)}},
      {
          $set: {
              nome: categoriaDados.nome,
              status: categoriaDados.status
          }
      }
  )
  .then(result => res.status(202).send(result))
  .catch(err => res.status(400).json(err))
  }
})


 export default router;