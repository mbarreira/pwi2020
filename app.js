var express = require ('express');
var app = express ();
var hbs = require ('express-handlebars');
var mongoose = require ('mongoose');

mongoose.promise = global.promise;

app.engine('handlebars', hbs());
app.set('view engine', 'handlebars');
app.use(express.urlencoded({extended:true}));

const RegistroSchema = mongoose.Schema({
    detalle: String,
    animo: String
});

const RegistroModel = mongoose.model('Registro', RegistroSchema);

async function conectar(){
    await mongoose.connect(
        'mongodb://10.128.35.136:27017/tricota2',
        {useNewUrlParser: true}
    )
    console.log('Conectado!');
}
conectar();

//--------------------------------------------
app.get('/altareg', function(req, res){
    res.render('carga');
});

app.post('/altareg', async function(req, res){
    if (req.body.detalle==''){
            res.render('carga', {
                error: 'Todos los campos son obligatorios',
                datos: {
                    detalle: req.body.detalle,
                    animo: req.body.animo
                }
            });
        return;
        }
    await RegistroModel.create({
        detalle: req.body.detalle,
        animo: req.body.animo
    });
    res.redirect('/tareas');
});

app.get('/tareas', async function(req, res){
    var aux = await RegistroModel.find().lean();
    res.render('tareas', {tareas: aux});
});


app.get('/borrar/:id', async function(req, res){
    var rta = await RegistroModel.findOneAndRemove({ _id: req.params.id});
    res.redirect('/tareas');
});

app.get('/editar/:id', async function(req, res){
    var registro = await RegistroModel.findById({_id: req.params.id}).lean();
    res.render('carga', {datos: registro});
});

app.post('/editar/:id', async function (req, res) {
    if (req.body.nombre == '') {
        res.render('carga', {
            error: 'Todos los campos son obligatorios',
            datos: {
                detalle: req.body.detalle,
                animo: req.body.animo
            }
        });
        return;
    } 
    await RegistroModel.findByIdAndUpdate({_id: req.params.id}, {
        detalle: req.body.detalle, 
        animo: req.body.animo
    });
    res.redirect('/tareas');
});


//--------------------------------------------
app.listen(8080, function(){
    console.log('App conectado en LocalHost');
});
