// Criando scatterplot
function boxplot(dataset,label,id){
	dataset.then(function(data) {

	// Margens
	var margin = {top: 40, right: 55, bottom: 50, left: 60};

	//Tamanho do svg
	var h = 350
	var w = 300

	//Tamanho do grafico
	var height = h - margin.top - margin.bottom;
	var width = w - margin.left - margin.right;

	// Criando svg
	var svg = d3.select(id)
	  .append("svg")
	  .attr("width",w)
	  .attr("height",h)
	  .append("g")
	  .attr("transform","translate(" + margin.left + "," + margin.top + ")");

	// Converte valores para numerico
	data.forEach(function(d) {
		d[label] = +d[label];
	});

	// Funcoes para retornar os valores dos dados
	var yValue = function(d) { return d[label];};

	// Variavel para as categorias
	var categories = ['Classe 0','Classe 1'];

	//Scale x
	var x = d3.scalePoint()
		.domain(categories)
		.rangeRound([0,width])
		.padding(0.5);

	//Scale y
	var y = d3.scaleLinear()
		.domain([d3.min(data,yValue)-0.7, d3.max(data,yValue)+0.7])
		.range([ height, 0]);

	// Eixos
	var xAxis = d3.axisBottom().scale(x);
	var yAxis = d3.axisLeft().scale(y);

	// Adicionando eixos x e y
	svg.append("g")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);
	svg.append("g")
		.call(yAxis);

	// Separando dataset em duas classes
	label0 = data.filter(function(d){
		if(d['target'] == '0'){
			return true;
		}
		return false;
	});
	label1 = data.filter(function(d){
		if(d['target'] == '1'){
			return true;
		}
		return false;
	});

	// Armazenando valores necessarios
	label0 = label0.map(function(d){
		return d[label];
	});
	label1 = label1.map(function(d){
		return d[label];
	});	

	// Ordenando
	label0.sort(compare);
	label1.sort(compare);

	// Medidas para boxplot
	label0 = {q1:d3.quantile(label0,0.25),median:d3.quantile(label0,0.50),q3:d3.quantile(label0,0.75),factor:(d3.quantile(label0,0.75)-d3.quantile(label0,0.25))*1.5,'target':'Classe 0'}
	label1 = {q1:d3.quantile(label1,0.25),median:d3.quantile(label1,0.50),q3:d3.quantile(label1,0.75),factor:(d3.quantile(label1,0.75)-d3.quantile(label1,0.25))*1.5,'target':'Classe 1'}
	measures = [label0,label1];

	// Largura do boxplot
	boxWidth = 50;

	//console.log(measures);

	// Criando as linhas verticais
	svg.selectAll('verticalLines')
		.data(measures)
		.enter()
		.append('line')
		.attr('x1',function(d){
			return x(d['target']);
		})
		.attr('y1',function(d){
			return y(d['q1']-d['factor']);
		})
		.attr('x2',function(d){
			return x(d['target']);
		})
		.attr('y2',function(d){
			return y(d['q3']+d['factor']);
		})
		.style('stroke','black');

	// Criando as caixas
	svg.selectAll('box')
		.data(measures)
		.enter()
		.append('rect')
		.attr('width',boxWidth)
		.attr('height',function(d){
			return y(y.domain()[1]-(d['q3']-d['q1']));
		})
		.attr('x',function(d){
			return x(d['target'])-boxWidth/2;
		})
		.attr('y',function(d){
			return y(d['q3']);
		})
		.attr('fill',function(d,i){
			return d3.schemeCategory10[i];
		})
		.attr("stroke", "black")
		.attr("stroke-width", 1);

	// Desenhando mediana
	svg.selectAll('median')
		.data(measures)
		.enter()
		.append('line')
		.attr('x1',function(d){
			return x(d['target'])+boxWidth/2;
		})
		.attr('y1',function(d){
			return y(d['median']);
		})
		.attr('x2',function(d){
			return x(d['target'])-boxWidth/2;
		})
		.attr('y2',function(d){
			return y(d['median']);
		})
		.style('stroke','black');

	// Desenhando top whisker
	svg.selectAll('topWhisker')
		.data(measures)
		.enter()
		.append('line')
		.attr('x1',function(d){
			return x(d['target'])+boxWidth/2;
		})
		.attr('y1',function(d){
			return y(d['q3']+d['factor']);
		})
		.attr('x2',function(d){
			return x(d['target'])-boxWidth/2;
		})
		.attr('y2',function(d){
			return y(d['q3']+d['factor']);
		})
		.style('stroke','black');	

	// Desenhando bottom whisker
	svg.selectAll('bottomWhisker')
		.data(measures)
		.enter()
		.append('line')
		.attr('x1',function(d){
			return x(d['target'])+boxWidth/2;
		})
		.attr('y1',function(d){
			return y(d['q1']-d['factor']);
		})
		.attr('x2',function(d){
			return x(d['target'])-boxWidth/2;
		})
		.attr('y2',function(d){
			return y(d['q1']-d['factor']);
		})
		.style('stroke','black');

	// Título
	svg.append('text')
		.attr('x',0)
		.attr('y',-15)
		.text(label.toUpperCase()+' divido por Classe')
		.attr('font-family','Helvetica')
		.attr('font-size','20px');

	});	
}

// Funcao para comparar no sort
function compare(a,b){
		return a-b;
}