// Desenhando o radarChart
function radarChart(dataset,n){
	dataset.then(function(data){

		d3.csv("https://raw.githubusercontent.com/LucasSugi/data-science/master/AccelerometerAnalysisParkinsonsCannabidiol/Data/target"+(n-1)+".csv").then(function(target){
			for (i=0;i<data.length;i++){
				data[i]['psp'] = +data[i]['psp'];
				data[i]['pse'] = +data[i]['pse'];
				data[i]['pspf'] = +data[i]['pspf']
				data[i]['target'] = target[i]['target'];
			}

			$.post('/mean',{file:JSON.stringify(data)}).done(function(response){

				// Options for the Radar chart, other than default
				var mycfg = {
					  w: 130,
					  h: 250,
					  maxValue: 0.6,
					  levels: 6,
					  ExtraWidthX: 300
				};

				// Percorre cada cluster
				for (i=0;i<n;i++){

					// Dados para o radarChart
					var d = [
						[{axis:'PSE',value:response['pse'][i]},{axis:'PSPF',value:response['pspf'][i]},{axis:'PSP',value:response['psp'][i]}]
					];

					// Desenha radarChart
					RadarChart.draw("#radarChart"+(i+1), d, mycfg,i);

				}

				// Dados para desenhar radarChart 'limpo'
				var clean = [
					[{axis:'PSE',value:0.0},{axis:'PSPF',value:0.0},{axis:'PSP',value:0.0}]
				];

				// Percore cada cluster
				for (;i<4;i++){
					// Desenha radarChart
					RadarChart.draw("#radarChart"+(i+1), clean, mycfg,i);
				}
            });
		});
	});
}