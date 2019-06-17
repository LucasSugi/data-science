// Espera o site carregar
$(document).ready(function(){
    // Assim que houver um arquivo processa
    $('#fileUpload').change(function(e){

        // Transforma arquivo em texto
   		var fileName = e.target.files[0]
        var reader = new FileReader();
        reader.readAsText(fileName);

        // Quantidade de clusters
        var n = $('#n_clusters').val()

        // Arquivo completamente lido
        reader.onload = function(e) {
            $.post('/cluster/'+n,{fileUpload:e.target.result}).done(function(data){

                // Mudando o texto da classe
                d3.select('#target_text')
                    .text(parseFloat(data['target'])+1);

                // Desenhando novo ponto no scatterplot 1
                drawNewPointScatterplot1([parseFloat(data['PSP']),parseFloat(data['PSE']),parseFloat(data['PSPF'])]);

                // Desenhando novo ponto no scatterplot 2
                drawNewPointScatterplot2([parseFloat(data['PSP']),parseFloat(data['PSE']),parseFloat(data['PSPF'])]);

                // Desenhando novo ponto no scatterplot 3
                drawNewPointScatterplot3([parseFloat(data['PSP']),parseFloat(data['PSE']),parseFloat(data['PSPF'])]);

            });
    	};
    });
});


// Desenha novo ponto no scatterplot 1
function drawNewPointScatterplot1(data){

    // Margens
    var margin = {top: 30, right: 30, bottom: 50, left: 60};

    //Tamanho do svg
    var h = 350
    var w = 400

    //Tamanho do grafico
    var height = h - margin.top - margin.bottom;
    var width = w - margin.left - margin.right;

    // Criando svg
    var svg = d3.select("#scatterplot_1");

    // Desenhnando pontos
    svg.append("circle")
        .attr("cx",x_scatterplot_1(data[0]))
        .attr("cy",y_scatterplot_1(data[1]))
        .attr("r",8)
        .attr('fill','black');
}

// Desenha novo ponto no scatterplot 2
function drawNewPointScatterplot2(data){

    // Margens
    var margin = {top: 30, right: 30, bottom: 50, left: 60};

    //Tamanho do svg
    var h = 350
    var w = 400

    //Tamanho do grafico
    var height = h - margin.top - margin.bottom;
    var width = w - margin.left - margin.right;

    // Criando svg
    var svg = d3.select("#scatterplot_2");

    // Desenhnando pontos
    svg.append("circle")
        .attr("cx",x_scatterplot_2(data[2]))
        .attr("cy",y_scatterplot_2(data[1]))
        .attr("r", 8)
        .attr('fill','black');
}

// Desenha novo ponto no scatterplot 3
function drawNewPointScatterplot3(data){

    // Margens
    var margin = {top: 30, right: 30, bottom: 50, left: 60};

    //Tamanho do svg
    var h = 350
    var w = 400

    //Tamanho do grafico
    var height = h - margin.top - margin.bottom;
    var width = w - margin.left - margin.right;

    // Criando svg
    var svg = d3.select("#scatterplot_3");

    // Desenhnando pontos
    svg.append("circle")
        .attr("cx",x_scatterplot_3(data[2]))
        .attr("cy",y_scatterplot_3(data[0]))
        .attr("r", 8)
        .attr('fill','black');
}
