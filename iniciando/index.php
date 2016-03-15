<html !Doctype>
<head>
	<title></title>

	<style type="text/css">
		<?php include("/css/layout-home.css") ?>
	</style>
	
	<script tyype="text/javascript">
		function ok() {
			alert("ok");
			return document.getElementById().text;
		}

		function requestCep() {
			var url = "//viacep.com.br/ws/" + 41750290 + "/json/";
			var xhr = new XMLHttpRequest();
			
			xhr.open("GET", url, true);

			xhr.onreadystatechange = function() {
				console.log("chegou");
				console.log(xhr.readystate);
				if(xhr.readystate == XMLHttpRequest.DONE) {
					return;
				}

				if(xhr.status == 200 ){
					console.log(xhr.responseText); 
				}
			}
			xhr.setRequestHeader("Content-Type", "text/json");
			xhr.send();	
		}

		function meu_callback(conteudo) {
        return conteudo;
        if (!("erro" in conteudo)) {
            //Atualiza os campos com os valores.
            document.getElementById('rua').value=(conteudo.logradouro);
            document.getElementById('bairro').value=(conteudo.bairro);
            document.getElementById('cidade').value=(conteudo.localidade);
            document.getElementById('uf').value=(conteudo.uf);
            document.getElementById('ibge').value=(conteudo.ibge);
        } //end if.
        else {
            //CEP não Encontrado.
            limpa_formulário_cep();
            alert("CEP não encontrado.");
        }
    }

		/*
		URL: viacep.com.br/ws/01001000/json/ 
		UNICODE: viacep.com.br/ws/01001000/json/unicode/

	    {
	      "cep": "01001-000", 
	      "logradouro": "Praça da Sé", 
	      "complemento": "lado ímpar",
	      "bairro": "Sé", 
	      "localidade": "São Paulo", 
	      "uf": "SP", 
	      "ibge": "3550308"
	    }
		*/

	</script>
</head>
<body>
	<div id="geral">
		<div id="header">
			<?php include("/pages/menu.php"); ?>
		</div>
		
		<div id="body">
			<div id="title"><span><h1>First Page in PHP!</h1></span></div>
			<div id="body-text">
				<p> Hello this is first page in php, it's is very good.</p>	
				<form action="" method="GET">
					<table>
						<tbody>
							<tr>
								<td><label for="nome">Nome</label></td>
								<td><input id="nome" type="text" name="nome"></td>
							</tr>

							<tr>
								<td><label for="tel">Telefone<label></td>
								<td><input id="tel" type="text" name="tel"></td>
							</tr>
								
							<tr>
								<td><label for="end">Endereço</label></td>
								<td><input id="end" type="text" name="end"></td>
							</tr>

							<tr>
								<td><label for="cep">CEP</label></td>
								<td><input id="cep" type="text" name="cep"></td>
							</tr>

							<tr>
								<td><label for="num">Numero</label></td>
								<td><input id="num" type="text" name="num"></td>
							</tr>

							<tr>
								<td><label for="comp">Complemento</label></td>
								<td><input id="comp" type="text" name="comp"></td>
							</tr>

							<tr>
								<td><label for="abc">Abc</label></td>
								<td><input id="abc" type="text" name="abc"></td>
							</tr>
							<tr>
								<td></td>
								<td><input type="submit" name="enviar" value="Enviar" onclick="requestCep()"></td>
							</tr>
						</tbody>	
					</table>		
					
				</form> 
			</div>
		</div>
		<input type="submit" name="enviar" value="Enviar" onclick="requestCep()">
		<div id="bottom">
			<div id="bottom-text">Copyright 2016 Jonatan Raimir. All right reseved.</div>
		</div>
	</div>

</body>
</html>