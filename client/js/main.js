
   
        var socket = io.connect('localhost:3000',{'forceNew':true})
   
        var user = prompt("Dime tu nombre");
        
     
        var room=document.getElementById("room").value;
 
        socket.emit('show-client',room);

        socket.on('connect', () => {
            console.log('Connected');
           
          });



        var myCodeMirror = CodeMirror.fromTextArea(document.getElementById("editor"), {
            lineNumbers: true,
            mode: "javascript",
            styleActiveLine: true,
            matchBrackets: true,
            autoCloseTags: true,
            autoCloseBrackets: true,
            enableCodeFormatting: true,
            showCommentButton: true,
            lineWrapping: true,
            extraKeys: {"Ctrl-Q": function(cm){ cm.foldCode(cm.getCursor()); }},
            foldGutter: true,
            gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]

           
        });


       

        myCodeMirror.on('keyup', function () {
            var msg = {
                room: room,
                user: user,
                value: myCodeMirror.getValue()
            }
         
            socket.emit('document-update',msg);
        });

        socket.on('doc', function(datos){
          
                if(datos.room==room && datos.user != user ){
              
                var current_pos = myCodeMirror.getCursor();
                myCodeMirror.getDoc().setValue(datos.value);
                myCodeMirror.setCursor(current_pos);
            }
            //}
            
        });


        
        socket.on('show', function(datos){

                console.log(datos[0]);
                if(datos[0].id_document == room){
                myCodeMirror.getDoc().setValue(datos[0].code);

                }
                
             
         });



        //SELECIONAR TEMA

        var inputT = document.getElementById("select");
        function selectTheme() {
            var theme = inputT.options[inputT.selectedIndex].textContent;
            myCodeMirror.setOption("theme", theme);
            location.hash = "#" + theme;
           // console.log(theme);
        }
        var choice = (location.hash && location.hash.slice(1)) ||
                    (document.location.search &&
                        decodeURIComponent(document.location.search.slice(1)));
        if (choice) {
            inputT.value = choice;
            myCodeMirror.setOption("theme", choice);
        }
        CodeMirror.on(window, "hashchange", function() {
            var theme = location.hash.slice(1);
            if (theme) { inputT.value = theme; selectTheme(); }
        });


        //Seleccionar Lenguaje
        var input = document.getElementById("selectlanguage");
        function selectlanguage() {
            var Lenguaje = input.options[input.selectedIndex].textContent;
            //myCodeMirror.setOption("mode", Lenguaje);
            //console.log(Lenguaje);
            
        }


        //leer mensaje del chat para enviarlo
        const formulario = document.querySelector('#formulario')
        const mensaje = formulario.querySelector('#texto')
        const chat = document.getElementById('chat')

        formulario.addEventListener('submit', (datos) => {	
            datos.preventDefault()
            var msg = {
                room: room,
                value: mensaje.value
            }
            console.log(mensaje.value)
            socket.emit('enviar-mensaje', msg);
         
           
        });

        
        socket.on('mostrar-msg', function(datos){
            console.log(datos);
           
                 if(datos.room==room ){
                
                chat.value  = chat.value + user +':'+datos.value+'\n';
             }
            
             
         });