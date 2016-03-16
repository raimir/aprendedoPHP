<html !Doctype>
<head>
	<title></title>

	<style type="text/css">
		<?php include("/css/layout-home.css") ?>
	</style>
	
	<script type="text/javascript">
		var bcep = document.getElementById("bcep");
		
		if ( bcep ) {
			bcep.addEventListener("click", requestCep); 
			bcep.addEventListener("click", function(){
				document.getElementById("cep").innerHTML = "asdfsdf";
			}); 
		}
	
		
		
		function ok() {
			alert("ok");
			return document.getElementById().text;
		}

		function requestCep(event) {
			var cep = document.getElementById("cep").value;
			var url = "//viacep.com.br/ws/" 
			
			if ( cep != null && cep != "" ) {
				url += cep + "/json/";
			}
			else {
				url += "41750290/json/";
			}
			var xhr = new XMLHttpRequest();
			
			xhr.open("GET", url, true);

			xhr.onreadystatechange = function() {
				console.log(xhr.readystate);
				if(xhr.readystate == XMLHttpRequest.DONE) {
					return;
				}

				if(xhr.status == 200 ){
					var js = JSON.parse(xhr.responseText);
					document.getElementById('log').value=(js.logradouro);
					document.getElementById('bairro').value=(js.bairro);
					//document.getElementById('cidade').value=(js.localidade);
					//document.getElementById('uf').value=(js.uf);
					//document.getElementById('ibge').value=(js.ibge);
				}
			}
			xhr.setRequestHeader("Content-Type", "text/json");
			xhr.send();	
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
								<td><button id="bcep" type="button" onclick="requestCep(this)">Buscar CEP</button></td>
							</tr>

							<tr>
								<td><label for="log">Logradouro</label></td>
								<td><input id="log" type="text" name="log"></td>
							</tr>
							
							<tr>
								<td><label for="num">Numero</label></td>
								<td><input id="num" type="text" name="num"></td>
							</tr>
							
							<tr>
								<td><label for="bairro">Bairro</label></td>
								<td><input id="bairro" type="text" name="bairro"></td>
							</tr>

							<tr>
								<td><label for="comp">Complemento</label></td>
								<td><input id="comp" type="text" name="comp"></td>
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