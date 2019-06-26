var express = require('express');
var app =express();
var server = require('http').Server(app);
var io = require('socket.io')(server); 
const port = 3000;
const path = require('path');
const hbs = require('hbs');
const dba =path.join(__dirname, 'server/dbConnetion');
const db = require(dba);
const connection = db();
const bodyParser = require('body-parser');
const session = require('express-session');



//-------------------//-------------------------------------------------------
const dir_views = path.join(__dirname, 'client');
const directorio_partials =  path.join(__dirname, 'client/partials');
app.set('view engine', 'hbs');
app.set('views', dir_views);
hbs.registerPartials(directorio_partials);

const directorio_publico = path.join(__dirname, '/client');
app.use(express.static(directorio_publico))

app.use(bodyParser.urlencoded({extended: false}));


app.use(session({
secret : 'a',
resave: false,
saveUninitialized: true

}));

//---------------------------BD-------------------------------------



//const server = http.createServer((req, res) => {
 /// res.statusCode = 200;
  //res.setHeader('Content-Type', 'text/plain');
  //res.end('Hola Mundo\n');
//});sudo /opt/lampp/lampp start

//----------------------Rutas-------------------------------


app.post('/login',function(req,res){
  const {email,pass,} = req.body;
  connection.query('SELECT * FROM user WHERE email_user = ? and pass_user =?'
  , [email, pass], (err,result) => {

    if(result.length > 0){
      req.session.id = result[0].id_user;
      req.session.name = result[0].name_user;

      res.redirect('inicio/'+result[0].id_user);
    }else{
      res.redirect('/');
    }
    
  });
 
  
});





app.get('/inicio/:id',function(req,res){
  id = req.params.id;
  console.log(id);
  connection.query('SELECT * FROM user_document WHERE id_user = ?'
  ,[id],(err,result)=>{
  
    if(result.length > 0){
     res.render('dashboard',{
      document:result,
     
     
    });
    
    }
    if(result.length == 0){
      res.render('dashboard',{
       document:result,
       error:"a"
      
     });
     
     }else{
      res.redirect('/');
    }


     //console.log(result);

  });
 
});


app.post('/crear',function(req,res){
  const {name,lenguaje,clase} = req.body;
  

  connection.query('INSERT INTO document SET?',{
    name_document: name,
    language_document: lenguaje,
    code:"comienza a escribir"
  }, (err,result) => {
   // console.log(result);
   
 
   res.redirect('document/'+result.insertId);
    
  });
 

  
});
app.get('/user_document/:id',function(req,res){
  id = req.params.id;

  connection.query('INSERT INTO user_document SET?',{
    id_user: req.session.id ,
    id_document: id
  }, (err,result) => {
   
    res.redirect('/document/'+id);
  });
 
});


app.get('/document/:id',function(req,res){
  id_room = req.params.id;
  console.log(id_room);
  connection.query('SELECT * FROM document WHERE id_document = ?'
  ,[id_room],(err,result)=>{
  console.log("lleo"+result);
    if(result.length > 0){

     

      res.render('document',{
        room: id_room,
       
      });
    }if(req.session.id){
      res.redirect('/inicio/'+req.session.id);
    }
    
    else{
      res.redirect('/');
    }

    //io.emit("show",result);
     //console.log(result);
  });

  
  
});

app.get('/salir',function(req,res){

  req.session.id = null;
  req.session.name = null;

  res.redirect('/');
 
});





//-----------------Actualizacion del docc------------------------ Update clientes Set nombre='José' Where nombre='Pepe'
io.on('connection',function(socket){
    console.log("a user connected");


    socket.on("disconnect", function() {
      console.log("user disconnected");
    });


    socket.on("show-client", function(id) {
     
      id_room = id;
console.log(id);
      connection.query('SELECT * FROM document WHERE id_document = ?'
      ,[id_room],(err,result)=>{

        io.emit("show",result);
        //console.log(result);
      });

    });


    
    socket.on("document-update", function(msg) {
      //console.log(msg); 
      //UPDATE `document` SET `document` = 'Holaa dd' WHERE `document`.`id` = 1;

      const id = msg.room;
      const code= msg.value;
      connection.query('UPDATE document set code = ? WHERE id_document = ?',[code,id],(err,result)=>{
     
      
   
       
     
     });  
     io.emit("doc",msg);
     
     //console.log(code);
       

     
      });
//RECIBIR EL MENSAJE DE CHAT de main.js

      socket.on('enviar-mensaje', function(msg) {
       // console.log(msg);
        // console.log(datos.room); UPDATE `document` SET `document` = 'Holaa dd' WHERE `document`.`id` = 1;
         const id = msg.room;
         const mensaje= msg.value;
         //connection.query('UPDATE document set code = ? WHERE id_document = ?',[code,id],(err,result)=>{
        //});  
       io.emit('mostrar-msg',msg); //doc
       //callback()
         });


/*client.on("enviar-mensaje", (text, callback) =>{
  let usuario = usuarios.getUsuario(client.id)
  let texto = `${usuario.nombre} : ${text}`
  
  io.emit("texto", (texto))
  callback()
})*/

});



//------------------------------------------------------------------

server.listen(port, function(){
  console.log("corriendo");





  
});