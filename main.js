// Milestone 1:
// •	Replica della grafica con la possibilità di avere messaggi scritti dall’utente (verdi) e dall’interlocutore (bianco) assegnando due classi CSS diverse (quindi tutto statico);
// •	Aggiunta di un messaggio: l’utente scrive un testo nella parte bassa e cliccando invia il testo viene aggiunto al thread sopra, come messaggio verde (quindi solo quello NON aggiungiamo dinamicamente anche quello bianco di risposta)
// BONUS: (ma solo se il resto è fatto)
// •	quando clicco sull’input e quindi il cursore è pronto a scrivere per l’inserimento messaggio, l’icona cambia

// Milestone 2:
// •	Risposta dall’interlocutore: ad ogni inserimento di un messaggio, l’utente riceverà un “ok” come risposta, che apparirà dopo 1 secondo.
// •	Ricerca utenti: scrivendo qualcosa nell’input a sinistra, vengono visualizzati solo i contatti il cui nome contiene le lettere inserite (es, Marco, Matteo Martina -> Scrivo “mar” rimangono solo Marco e Martina)

// Milestone 3:
// •	Click sul contatto mostra la conversazione del contatto cliccato,
// •	è possibile inserire nuovi messaggi per ogni conversazione
// •	Cancella messaggio: cliccando sul messaggio appare un menu a tendina che permette di cancellare il messaggio selezionato
// BONUS: (ma solo se il resto è fatto)
// •	cambio info nell’header;
// •	Inserire il messaggio “Sta scrivendo” e poi cancellarlo all’arrivo del messaggio

// aggiungiamo la gestione di Templating tramite Hamdlebars al nostro BoolzApp
// DESCRIZIONE:
// inserimento msg nostro;
// msg di risposta automatica;
// entrambi usando un template unico e quindi gestendo la classe (o come avete strutturato) sempre in maniera dinamica.



$(document).ready(function(){

  // creo variabile input dove scrivo mex
  var inputMex = $(".write-mex");
  // creo variabile chat (finestra mex)
  var chatUtente = $('.chat-des');
  // creo variabile input dove cerco chat
  var cercaContatti = $('.cerca-contatti');
  // creo variabile nome singola chat
  var nomeChat = $('.chat-nome h3');

  // inizializzo template handlebars
  var source = $('#msg-template').html();
  var template = Handlebars.compile(source);

  // creo variabile per generare l'ora e se ora e minuti hanno una sola cifra aggiungo "0"
  var date = new Date();
  var ora = date.getHours();
  if (ora < 10) {
    ora = '0' + ora
  }
  var minuti = date.getMinutes();
  if (minuti < 10){
    minuti = '0' + minuti
  }
  date = ora + ':' + minuti;

  // al click su footer-mexsend invio mex
  $('.footer-mexsend').click(inviaMex);

  // da tastiera premo invio, invio mex
  inputMex.keypress(invioTasto);

  // per cambio di icona quando scrivo un mex
  inputMex.keypress(iconeInvio);

  // per cercare singola chat nella lista
  cercaContatti.keyup(cercaChat);

  // al click nome amico apro la sua chat
  $('.chat').click(collegoChatMex);

  // mouseover su ogni mex per fa-chevron-down mostra
  // RICORDA on perchè mex sono statici e dinamici
  $('.chat-des').on("mouseover", ".mex", function(){
    $(this).find('.fa.fa-chevron-down').show();
  });

  // mouseleave su ogni mex per fa-chevron-down nascondi
  // RICORDA on perchè mex sono statici e dinamici
  $('.chat-des').on("mouseleave", ".mex", function(){
    $(this).find('.fa.fa-chevron-down').hide();
  });

  // al click di fa-chevron-down mostro menu
  $('.chat-des').on("click", ".fa.fa-chevron-down", function(){
    $(this).next().next('.infomsg').show();
    // $(this).siblings('.infomsg').show();
  });

  // aperto il menu se clicco su delete cancello quel mex
  $('.chat-des').on('click','.delete', function(){
    // $(this).parent().parent().parent().remove();
    $(this).closest(".mex").remove();
  });

  // per chiudere il menu clicco su exit
  $('.chat-des').on('click','.exit', function(){
    $('.infomsg').hide();
  });


  // --- funzioni ---

  // Funzione invia mex
  function inviaMex(){
    // creo variabile per salvare il mex inserito
    var mex = inputMex.val();

    // handlebars scrittura mex
    var mexInviato = {"mess": mex, "classMex": "inviati", "orario": date};;
    var htmlInviato = template(mexInviato);


    // se non è vuoto e se non ha uno spazio aggiungo il mex più ora
    if (mex != "" && mex != " ") {
      // senza template handlebars
      // $('.chat-des.active').append('<div class="mex inviati clearfix"><p class="mex-testo">' + mex + '</p><span><i class="fa fa-chevron-down"></i></span><span class="mex-ora">' + date + '</span><div class="infomsg"><ul><li>Info messaggio</li><li class="delete">Cancella messaggio</li><li class="exit">Exit</li></ul></div></div>');

      // se rispetta l'if "appendo" il mex che scrivo grazie a handlebars
      $('.chat-des.active').append(htmlInviato);

      // azzero input
      inputMex.val("");

      // mentre aspetto la risp sotto il nome appare che sta scrivendo
      $('.header-des-nome p').html('Sta scrivendo...');

      // risposta amico dopo un secondo
      setTimeout(rispMex, 1000);
    }
  }

  // funzione che invia mex con tasto invio
  function invioTasto(e){
    var key = e.which;
    var inputMsg = inputMex.val();
    if(key == 13){ // 13 tasto invio
      inviaMex();
    }
  }

  // funzione per cambio di icone quando input vuoto o con testo
  function iconeInvio(){
    if($(this).val() == ""){
      $('.fa-telegram-plane').hide();
      $('.fa-microphone').show();
    }else{
      $('.fa-telegram-plane').show();
      $('.fa-microphone').hide();
    }
  }

  // funzione risposta mex amico
  function rispMex() {
    // creo variabile qui... fuori no!!
    // la finestra chat ricorda attiva altrimenti mex sono in ogni chat
    var chatUtenteActive = $('.chat-des.active');

    // handlebars scrittura mex
    var mexRicevuto = {"mess": "Ok!", "classMex": "ricevuti", "orario": date};
    var htmlRicevuto = template(mexRicevuto);

    // senza template handlebars
    // aggiungo mex amico "ok"
    // chatUtenteActive.append('<div class="mex ricevuti clearfix"><p class="mex-testo">0K!</p><i class="fa fa-chevron-down"></i><span class="mex-ora">' + date + '</span><div class="infomsg"><ul><li>Info messaggio</li><li class="delete">Cancella messaggio</li><li class="exit">Exit</li></ul></div></div>');

    // "appendo" il mex di risposta "Ok!" grazie a handlebars
    chatUtenteActive.append(htmlRicevuto);

    // dopo la risposta mi dice ultimo accesso
    $('.header-des-nome p').html("Ultimo accesso oggi alle " + date);
  }

  // funzione per cercare singola chat nella lista
  function cercaChat() {
    // creo variabile e salvo testo inserito
    var cercaNomeChat = cercaContatti.val();

    // cerco in tutta la lista se il nome inserito compare
    nomeChat.each(function(){

      if($(this).text().toLowerCase().includes(cercaNomeChat.toLowerCase())){
        // compare allora show
        // $(this).parent().parent().parent().show();
        $(this).closest(".chat").show();
      }else{
        // non compare allora hide
        // $(this).parent().parent().parent().hide();
        $(this).closest(".chat").hide();
      }
    })
  }

  // funzione che abbina alla singola chat della lista la sua finestra
  function collegoChatMex(){

    // lista chat
    // attiva al click
    $('.chat').removeClass('attivo');
    $(this).addClass('attivo');

    // stesso img cliccato lista va nell' header finestra chat
    var imgAttivo = $('.attivo>.chat-img>img').attr('src');
    $('.header-des-img>img').attr('src', imgAttivo);

    // stesso nome cliccato lista va nell' header finestra chat
    var nomeAttivo = $('.attivo').find($('.chat-nome h3')).text();
    $('.header-des-nome h3').text(nomeAttivo);

    // associato nome e img ora associo finestra
    // quindi funzione

    // cerco tra tutte le chat
    $('.chat-des').each(function(){
      // data-
      // attr
      // se data- della chat della lista corrisponde al data- della finestra
      if($('.attivo').data('chatamico') == $(this).data('conversazione')){

        // visualizzo solo la sua finestra chat
        $('.chat-des').removeClass('active');
        $(this).addClass('active');
      }
    })
  }
})
