// Colorindo scatterplot
function color_scatterplot(dataset,n){
	dataset.then(function(data){

		// Testando o numero de clusters
		if(n == 2){
			// Color scale: give me a specie name, I return a color
			var color = d3.scaleOrdinal()
				.domain(['0','1'])
				.range(d3.schemeCategory10);
		}
		else if(n == 3){
			// Color scale: give me a specie name, I return a color
			var color = d3.scaleOrdinal()
				.domain(['0','1','2'])
				.range(d3.schemeCategory10);
		}
		else{
			// Color scale: give me a specie name, I return a color
			var color = d3.scaleOrdinal()
				.domain(['0','1','2','3'])
				.range(d3.schemeCategory10);	
		}

		// Colorindo scatterplo1
		d3.select('#scatterplot_1')
			.selectAll('.point')
			.data(data)
			.attr('fill',function(d){return color(d['target'])});

		// Colorindo scatterplo2
		d3.select('#scatterplot_2')
			.selectAll('.point')
			.data(data)
			.attr('fill',function(d){return color(d['target'])});

		// Colorindo scatterplo3
		d3.select('#scatterplot_3')
			.selectAll('.point')
			.data(data)
			.attr('fill',function(d){return color(d['target'])});

	});
}