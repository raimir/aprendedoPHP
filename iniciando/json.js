
var nomeCampanha = document.getItemValueString("nomecampanha");
var nomePlano = document.getItemValueString("nomePlanoDisparo");
var hora = document.getItemValueInteger("horaenvio");
var docEnvio = document.getDocument(true); 

var selecoes = [];
if ( !viewScope._form.view.todosSelecionados ) {
    selecoes = xtrViewSelecionadosCod();
}   

if ( nomePlano == "" )          xtrFormMsg("Informe o nome do Modelo.", "nomePlanoDisparo");
if ( nomeCampanha == "" )       xtrFormMsg("Informe o nome da campanha.", "nomecampanha");
if ( hora < 0 || hora > 23 )    xtrFormMsg("Informe a hora no intervalo entre 0 e 23.", "horaenvio");

if ( nomePlano != "" &&  nomeCampanha != "" ) {
    xtr_sendPlanoDisparo( docEnvio, selecoes, viewScope._form.view.todosSelecionados );
}

/*
var db = session.getDatabase("xtr-tinto/consiste", "app-data\\desenvolvimento\\planodisparofila-v1.nsf", false);
var dbPlano = session.getDatabase("xtr-tinto/consiste", "app-data\\desenvolvimento\\planodisparocadastro-v1.nsf", false);
var vPlano = dbPlano.getView("PLANODISPAROCADASTRO-descricao");
var docPl = vPlano.getNthDocument(3);

var doc:NotesDocument = db.createDocument();
doc.replaceItemValue("xtr_cod", "planodisparofila-v1-" + doc.getUniversalID());
doc.replaceItemValue("xtr_criado_data", doc.getCreated());
doc.replaceItemValue("xtr_criado_usuario", "jonatanraimir@consiste.com.br");
var dt = session.createDateTime("Today");
dt.setNow();
doc.replaceItemValue("dt_agendada", dt); 
doc.replaceItemValue("dt_disparo", dt);
doc.replaceItemValue("statusdisparo", "Ativo");
doc.replaceItemValue("ref_planodisparocadastro", docPl.getItemValueString("xtr_cod"));


doc.replaceItemValue("check", "nenhum");
var arrcselect = xtrViewSelecionadosCod();
var dados = viewScope._form.view.source.dados;
doc.replaceItemValue("contatosvisao", dados[0].visao);
doc.replaceItemValue("contatosfiltracategoria", dados[0].filtrarCategoria);
doc.replaceItemValue("contatosselecionados", arrcselect);

doc.save(true, false);
//doc.instalacao
*/
function xtr_sendPlanoDisparo( docFunc:NotesDocument, docSelecionados:Array, selecionarTodos:boolean ) {
    var nomeAgente = "filaPlanoDisparo-v1";

    //variáveis de referência
    var ref_planodisparocadastro = docFunc.getItemValueString("ref_planodisparocadastro");
    var ref_instalacao = viewScope._sessao.ref_instalacao;
    //var ref_blacklistCadastro;
    //var ref_segmentacao;
    //var ref_emailcampanha;
    //var ref_metricaemail;
    
    //identificação da instalação
    var instalacao = xtrItem("identificacao", viewScope._sessao.ref_instalacao)[0];
    var idInstalacao = xtrItem("identificacao", viewScope._sessao.ref_instalacao)[0];
    
    var docPlanoDisparo = xtrDoc(ref_planodisparocadastro);
    var entPlDisparo = ref_planodisparocadastro.split("-")[0];
    var viewPrincipal = viewScope._form.view.dados[0].visao;
    var filtroPrincipal = viewScope._form.view.dados[0].filtrarCategoria;
    



    //nome da entidade principal
    var entidadePrincipal = new function() { 
        var visao = xtrVisao(viewPrincipal);
        var doc = visao.getFirstDocument();
        var xtr_cod = doc.getItemValueString("xtr_cod");
        var ent = xtr_cod.split("-");
        return ent[0] + "-" + ent[1];
    };
    
    //docSelecionados
    var docSelecionados = new function() {
        if ( docSelecionados == null || docSelecionados.length < 1 ) docSelecionados = "";
        if ( docSelecionados != null && docSelecionados.length > 0 ) docSelecionados = xtrJson( docSelecionados );
        return docSelecionados;
    }

    
    //pegando as entidades basicas nome e versão
    var entidadesBasicas = new function() {
        var entidades = new Array();
        var visao:NotesView = xtrVisao("ENTIDADE-tipo-chave");
        var colec:NotesDocumentCollection = visao.getAllDocumentsByKey( "XTR", true );
        if ( colec != null && colec.getCount() > 0 ) {
            var doc = colec.getFirstDocument();
            while ( doc != null ) {
                var nome = doc.getItemValueString("nome");
                var versao = doc.getItemValueInteger("versao");
                entidades.push( nome + "-v" + versao );
                doc = colec.getNextDocument( doc );
            }   
        }
        return entidades;
    }
    
    //pegando todas as entidades que não são basicas usadas nessa operação
    var entidadesApp = new function() {
        var appModelo = xtrApp( docModelo.getItemValueString("xtr_criado_instancia") );
        var entidadesAppPrincipal = xtrAppParametro( "_entidades" );
        var entidadesModelo = xtrAppParametro( "_entidades", appModelo );
        var entidades = entidadesAppPrincipal;
        for ( var x in entidadesModelo ) {
            if ( entidades.indexOf(entidadesModelo[x]) == -1 )
                entidades.push( entidadesModelo[x] );
        }
        return entidades;
    }
    
    //objeto contendo o nome da entidade como propriedade e recebendo um array com duas posições
    //sendo nome do servidor e arquivo
    var entidadesArquivos = new function() {
        var pathLogEmail = "app-data\\" + idInstalacao + "\\logemail\\" + codModelo + ".nsf";
        var entidade = {
            perfil: ["xtr-tinto/consiste", "Caracteristicas Pessoais.nsf"],
            citacoes: ["xtr-tinto/consiste", "citacoes.nsf"],
            eventos: ["notesintsrv01/notesint", "domino\\html\\consiste\\consistehomepage.nsf"],
            big: ["xtr-tinto/consiste", "app-data\\BIGOrigem.nsf"]
        };      
        
        for( var e in entidadesApp ) {
            var ent = entidadesApp[e].split("-");
            var db:NotesDatabase = xtrDatabase( ent[0] );
            if ( db != null && db.isOpen() ) {
                entidade[ent[0]] = [db.getServer(), db.getFilePath()];
            }
        }
        delete entidade["logemail"];
        
        //caminho do arquivo de log do modelo pois este caminho é uma exceção do padrão
        entidade["logemail"] = [ docModelo.getParentDatabase().getServer(), pathLogEmail ];
        
        return entidade;
    };
    
    //pegando o relacionamentos e campos da entidade
    var viewEnt = xtrVisao( "ENTIDADE-chave"  );
    var docEnt = viewEnt.getDocumentByKey( entidadePrincipal, true );
    var campos = xtrJsonParse(docEnt.getItemValueString( "variaveis" ));
    
    //verificando criando entidades e verificando se existe relacionamento com alguma outra entidade dentro dos campos
    var relacionamentos = new function() {
        var rel = new Array();
        var count = 0;
        var relacionamentos = [];
        for ( var c in campos ) { 
            if( campos[c].indexOf(".") != -1 ) {
                var prop = campos[c].split(".")
                if ( rel.indexOf("ref_" + prop[0]) == -1 ) {
                    rel.push( "ref_" + prop[0] );
                }
            }       
        }
        
        if ( rel.length > 0 )
            relacionamentos = rel;
    
        return relacionamentos;
    }
    
    //pegando contas smtp
    var contassmtp = new function() {
        var v:NotesView = xtrVisao("CONTASMTP-cod");
        var col = v.getAllDocumentsByKey( "contasmtp", false );
        var contas = new Array();
        var doc = col.getFirstDocument();
        while ( doc != null ) {
            var objSmtp = {
                usuario: doc.getItemValueString("usuario"),
                senha: doc.getItemValueString("senha"),
                servidor: doc.getItemValueString("servidor"),
                porta: doc.getItemValueInteger("porta")
            }
            contas.push( objSmtp );
            doc = col.getNextDocument(doc);
        }
        return contas;
    }
    
    // nome e referência
    var planodisparo = {
        nome:    docFunc.getItemValueString("nomePlanoDisparo"),
        xtr_cod: docFunc.getItemValueString("ref_planodisparocadastro");
    }     

   
    //blacklist nome e referência
    var blacklist = {
            nome: docFunc.getItemValueString( "nomeBlacklistCadastro" ),
            xtr_cod: docFunc.getItemValueString( "ref_blacklistCadastro" )
    };
    
    //segmentacao nome e o código de referência
    var segmentacao = {
            nome: docFunc.getItemValueString ( "nomesegmentacao" ),
            xtr_cod: docFunc.getItemValueString ( "ref_segmentacao" )
    };
    
    // Check do email
    var check = new function() {
        var tipoCheck = docFunc.getItemValueString( "checkemail" );
        if ( tipoCheck == null || tipoCheck == "" ) return "nenhum";
        else return tipoCheck;
    }
    
    //verifica se o envio é autenticado ou não
    var autenticado = new function() {
        var autentic = docFunc.getItemValueString( "sendAuth" );
        if ( autentic == "1" ) return 1;
        else return 0;
    }   
    
    //data do agendamento
    var dataHora = new function() {
        docFunc:NotesDocument = null;
        var dtDataHora:NotesDateTime = null;
        var dtData:java.util.Vector = docFunc.getItemValue( "dataenvio" );
        var hora = docFunc.getItemValueInteger( "horaenvio" );
        var data:NotesDateTime;
        
        //data
        if( !dtData.isEmpty() ) {
            data = dtData.get(0); 
            dtDataHora = session.createDateTime(data.getDateOnly() + " " + hora );
        }
        
        if ( dtDataHora == null ) {
            dtDataHora = session.createDateTime("Today " + hora);
        }
        return dtDataHora; 
    }   
    
    
    //flag do agendamento
    var agendado = new function() {
        if (dataHora != null) return 1;
        return 0;
    }
    
    //selecionar todos
    if ( selecionarTodos == true ) selecionarTodos = 1
    else if ( selecionarTodos != true ) selecionarTodos = 0
    
    
    //Campanha nome e referência
    var campanha = new function() {
        var nomeCampanha = docFunc.getItemValueString("nomecampanha");
        var viewCamp:NotesView = xtrVisao("EMAILCAMPANHA-nomecampanha");
        var doc:NotesDocument = viewCamp.getDocumentByKey( nomeCampanha, true );
        if ( doc == null || !doc.isValid() ) {
            doc = xtrFormReservarDocumento("emailcampanha");
            //doc.replaceItemValue("ref_modeloemail", codModelo );
            doc.replaceItemValue("qtdContatos",0);
            doc.replaceItemValue("qtdEmails",0);
            doc.replaceItemValue("qtdEnvios",0);
            doc.replaceItemValue("qtdClicks",0);
            doc.replaceItemValue("qtdLog",0);
            doc.replaceItemValue("qtdBlacklist",0);
            doc.replaceItemValue("qtdDisparos",0);
            doc.replaceItemValue("nomecampanha",nomeCampanha);
            xtrFormSalvarDocumento(doc);
        }
        
        return {
            nome: nomeCampanha,
            xtr_cod: doc.getItemValueString("xtr_cod")
        };
    }
    
    var docJob:NotesDocument = xtrFormReservarDocumento("job");
    
    //Campanha nome e referência
    docJob.replaceItemValue ( "nomeCampanha", campanha.nome );
    docJob.replaceItemValue ( "ref_emailcampanha", campanha.xtr_cod );
    
    //Modeloemail nome e referência
    docJob.replaceItemValue ( "nomePlanoDisparo", planodisparo.nome );
    docJob.replaceItemValue ( "ref_planodisparocadastro", planodisparo.xtr_cod );
    
    //blacklist nome e referência da blacklist
    docJob.replaceItemValue ( "nomeBlacklist", blacklist.nome );
    docJob.replaceItemValue ( "ref_blacklistCadastro", blacklist.xtr_cod );
    docJob.replaceItemValue ( "blacklist", blacklist.nome );
    docJob.replaceItemValue ( "blacklistXtrCod", blacklist.xtr_cod );
    
    //nome e referência da segmentacao, data e hora
    docJob.replaceItemValue ( "nomesegmentacao", segmentacao.nome );
    docJob.replaceItemValue ( "ref_segmentacao", segmentacao.xtr_cod );
    
    
    //nome e filtro da visão de selecionados
    docJob.replaceItemValue ( "entidadePrincipal", entidadePrincipal );
    docJob.replaceItemValue ( "viewPrincipal", viewPrincipal );
    docJob.replaceItemValue ( "filtroPrincipal", filtroPrincipal );
    docJob.replaceItemValue ( "idInstalacao", idInstalacao );
    
    docJob.replaceItemValue( "entidadesBasicas", xtrJson(entidadesBasicas) );
    docJob.replaceItemValue( "entidadesApp", xtrJson(entidadesApp) );
    docJob.replaceItemValue( "entidadesArquivos", xtrJson(entidadesArquivos) );
    
    docJob.replaceItemValue ( "codModelo", codModelo );
    docJob.replaceItemValue ( "docSelecionados", docSelecionados );
    docJob.replaceItemValue( "selecionarTodos", selecionarTodos );
    
    docJob.replaceItemValue ( "checkEnvio", check );
    //docJob.replaceItemValue ( "horaEnvio", dataHora.hora );
    
    //docJob.replaceItemValue ( "agendado", agendado );
    docJob.replaceItemValue ( "autenticado", autenticado );
    docJob.replaceItemValue ( "envioAutenticado", autenticado );
    
    docJob.replaceItemValue( "campos", xtrJson(campos) );
    docJob.replaceItemValue( "relacionamentos", xtrJson(relacionamentos) );
    docJob.replaceItemValue( "contassmtp", xtrJson(contassmtp) );
    docJob.replaceItemValue( "job_agente", nomeAgente );
    
    if ( agendado == 1 ) {
        docJob.replaceItemValue( "job_status", "AGENDADO" );
        docJob.replaceItemValue ( "job_dataagendamento", dataHora );
    }
    
    xtrFormSalvarDocumento(docJob);
}
   