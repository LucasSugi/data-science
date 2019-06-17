function score(){

	// Margens
	var margin = {top: 175, right: 0, bottom: 0, left: 150};

	//Tamanho do svg
	var h = 310
	var w = 300

	// Criando svg
	var svg = d3.select("#score")
	  .append("svg")
	  .attr("width",w)
	  .attr("height",h)
	  .append("g")
	  .attr("transform","translate(" + margin.left + "," + margin.top + ")");

	// Raio e circunferencia
	var r = 100;
	var p = Math.PI * 2;

	// Criando arco
	var arc = d3.arc()
		.innerRadius(r-20)
		.outerRadius(r)
		.startAngle(0)
		.endAngle(p);

	// Display na tela
	svg.append('path')
		.attr('d',arc)
		.attr('fill','gray')
		.attr('stroke','black')
		.attr('stroke-width','1.5px');

	// Classificacao
	svg.append('text')
		.attr('id','target_text')
		.attr('x',0)
		.attr('y',15)
		.attr("text-anchor", "middle")
		.style("font-family", "Helvetica")
		.style("font-size", "50px")
		.text('?');

	// Título
	svg.append('text')
		.attr('x',0)
		.attr('y',	-130)
		.attr("text-anchor", "middle")
		.style("font-family", "Helvetica")
		.style("font-size", "20px")
		.text('Score');

	// Botao para escolher arquivo
	d3.select('#score')
		.append('input')
		.attr('type','file')
		.attr('name','fileUpload')
		.attr('id','fileUpload');

	// Texto indicando o que eh o input range
	d3.select('#score')
		.append('span')
		.text('N° clusters')

	// Input para selecionar o número de clusters
	d3.select('#score')
		.append('input')
		.attr('type','range')
		.attr('name','n_clusters')
		.attr('id','n_clusters')
		.attr('min',2)
		.attr('max',4)
		.attr('step',1)
		.attr('value',2)
		.attr('oninput','display.value=value')
		.attr('onchange','display.value=value');

	// Input para mudar o texto do número de clusters
	d3.select('#score')
		.append('input')
		.attr('type','text')
		.attr('id','display')
		.attr('value',2)
		.attr('readonly',true);
	
}