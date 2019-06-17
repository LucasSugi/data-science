// Espera o site carregar
$(document).ready(function(){
    // Assim que houver um arquivo processa
    $('#n_clusters').change(function(e){

    	// SCATTERPLOT

        // Quantidade de clusters
        var n = $('#n_clusters').val()

        // Leitura do target
        var dataset_y = d3.csv("https://raw.githubusercontent.com/LucasSugi/data-science/master/AccelerometerAnalysisParkinsonsCannabidiol/Data/target"+(n-1)+".csv");

        // Colorindo scatterplot
        color_scatterplot(dataset_y,n);

        // SCORE

		// Leitura do arquivo do input
		var file = $('#fileUpload')[0].files[0];

		if(file){
			// Cria objeto reader
			var reader = new FileReader();

			// Leitura do arquivo
			reader.readAsText(file);
			reader.onload = function(e) {
			$.post('/cluster/'+n,{fileUpload:e.target.result}).done(function(data){
				// Mudando o texto da classe
				d3.select('#target_text')
					.text(parseFloat(data['target'])+1);
				});
			};
		}

		// RADAR CHART

		// Removendo radarChart atuais
		$('#radarChart1').remove();
		$('#radarChart2').remove();
		$('#radarChart3').remove();
		$('#radarChart4').remove();

		// Append novamente
		$('#features').append("<div id='radarChart1'><div>");
		$('#features').append("<div id='radarChart2'><div>");
		$('#features').append("<div id='radarChart3'><div>");
		$('#features').append("<div id='radarChart4'><div>");

		// Leitura das variaveis
		var dataset = d3.csv("https://raw.githubusercontent.com/LucasSugi/data-science/master/AccelerometerAnalysisParkinsonsCannabidiol/Data/parkinson_clustering.csv");

		// Desenhando radarChart
		radarChart(dataset,n);

    });
});