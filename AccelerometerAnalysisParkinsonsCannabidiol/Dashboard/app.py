from flask import Flask, render_template, jsonify, request
import unsupervised_learning as ul
import numpy as np
import pandas as pd
import json
import io

# Carregando os modelos
kmeans1,kmeans2,kmeans3 = ul.load_models()

# Criando app
app = Flask(__name__)

# Index - main html file
@app.route('/')
def index():
	return render_template('index.html')

# Wiki - help page
@app.route('/wiki')
def wiki():
	return render_template('wiki.html')

# Cluster - apply clustering in data
@app.route('/cluster/<int:n_clusters>',methods=['POST'])
def cluster(n_clusters):

	# Request do arquivo
	csv = request.form['fileUpload']

	# Transformando str em float
	matrix = []
	for row in csv.split():
		obs = [x for x in row.split(',')]
		matrix.append(np.asarray(obs, dtype=float))
	matrix = np.array(matrix)

	# Processando dados
	df = ul.process_data(pd.DataFrame(matrix))

	# Predizendo classe
	if(n_clusters == 2):
		print(n_clusters)
		target = kmeans1.predict(df[['pse','psp','pspf']])
	elif(n_clusters == 3):
		print(n_clusters)
		target = kmeans2.predict(df[['pse','psp','pspf']])
	else:
		print(n_clusters)
		target = kmeans3.predict(df[['pse','psp','pspf']])

	# Construindo dados para envio
	data = {'PSE':str(df['pse'].values[0]),'PSP':str(df['psp'].values[0]),'PSPF':str(df['pspf'].values[0]),'target':str(target[0])}

	return jsonify(data)

@app.route('/mean',methods=['POST'])
def mean():

	# Request do arquivo
	csv = request.form['file']

	# Convert para dataframe
	df = pd.DataFrame(json.loads(csv))

	# Calcula a media para cada target
	df = df.groupby('target').mean()

	# Porcentagens
	df = df.apply(lambda x: round(x/x.sum(),2),axis=0)

	return jsonify(df.to_dict())

if __name__ == '__main__':
	app.run()