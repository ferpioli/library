import express from "express";
import livros from "../data/livros.json";
import mongoose from "mongoose";



const DB_URL = "mongodb+srv://admin:admin@cluster0.chi5w.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose.connect(DB_URL, { useUnifiedTopology: true, useNewUrlParser: true });

const db = mongoose.connection;

db.once("", () => {
    console.log("Estanmos conectados ao MongoDB")
});

const livrosSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    titulo: String,
    tipo: String
});

const livrosModel = mongoose.model("livros", livrosSchema);

const router = express.Router();

let livrosArray = livros;

router.get("/", (req, res) => {
    livrosModel.find((err, livro) => {
        if (err) res.status(500).send(err);
        res.json(livro);
    });
});

router.get("/:id", (req, res) => {
    /*  const livro = livros.find(value => value.id == req.params.id);
  
      if (livro) {
          res.json(livro);
      } else {
          res.send('livro não encontrado');
      }
      res.end();*/
    livrosModel.findById(req.params.id, (err, livro) => {
        if (livro) {
            res.json(livro);
        } else {
            res.status(404).send(`livro com id ${req.params.id} não encontrado`);
        }
        res.end();
    })
});


router.post("/", (req, res) => {
    /* console.log(req.body);
     livrosArray.push(req.body);
     res.status(200).send("Ok");
     res.end();*/
    const id = new mongoose.Types.ObjectId();
    const livroParaSalvar = Object.assign({
        _id: id
    }, req.body);
    //console.log(JSON.stringify(livroParaSalvar));
    const livro = new livrosModel(livroParaSalvar);
    livro.save().then((err, livro) => {
        if (err) res.status(500).send(err);
        res.json(livro);
    });
});


router.put("/:id", (req, res) => {
    livrosModel.findById(req.params.id, (err, livro) => {
        if (livro) {
            livro.titulo = req.body.titulo;
            livro.tipo = req.body.tipo;

            livro.save().then((err, livro) => {
                if (err) res.status(500).send(err);
                res.json(livro);

            });

        } else {
            res.status(404).send(`Livro com ID ${req.params.id} não encontrado`)
        }
    });

});

router.delete("/:id", (req, res) => {
   livrosModel.findByIdAndDelete(req.params.id, (err, livro) => {
       if(err)res.status(500).send(err);
       res.status(200).send(`Livro com id ${req.params.id} deletado com sucesso.`)
   })
});

/*router.param("id", (req, res, next, id) => {
    if (isNaN(id)) {
        next("não é numero");
    } else {
        next();
    }

});*/
export default router;