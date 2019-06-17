import numpy as np
import pandas as pd
import pickle
from urllib.request import urlopen 
from scipy.stats import skew, kurtosis

''' Realiza o pre-processamento nos dados'''
def process_data(df):

    # Exclui primeira e ultima observacao
    df = df.iloc[1:-1,:]

    # Criando serie temporal
    ts = np.sqrt((df**2).apply(lambda x: x.sum(),axis=1))

    # Normalizando
    ts = (ts - np.mean(ts)) / np.std(ts)

    # Fourier Transform
    tsF  = np.fft.fft(ts[10:-10])

    # Power Spectrum within Maximum Frequency
    tfPS = np.abs(tsF[0:32])**2

    # Feature 1: Power Spectrum Entropy
    tfPSprob = (tfPS - np.min(tfPS)) / (np.max(tfPS) - np.min(tfPS))
    pse = -sum(tfPSprob * np.log(0.001+tfPSprob))
    tfPS[0] = 0

    # Feature 2a: Power Spectrum Frequency Peak
    pspf1 = np.argmax(tfPS)

    # Feature 3a: Power Spectrum Peak Value
    psp1  = np.max(tfPS)
    tfPS[pspf1-1:pspf1+1+1] = 0

    # Feature 2b: Power Spectrum Frequency Peak
    pspf2 = np.argmax(tfPS)

    # Feature 3b: Power Spectrum Peak Value
    psp2  = np.max(tfPS)
    tfPS[pspf2-1:pspf2+1+1] = 0

    # Feature 2c: Power Spectrum Frequency Peak
    pspf3 = np.argmax(tfPS)

    # Feature 3c: Power Spectrum Peak Value
    psp3  = np.max(tfPS)

    # Criando DataFrame
    df_features = [pse, pspf1, pspf2, pspf3, psp1, psp2, psp3]
    df_features = pd.DataFrame(df_features).T

    cols = ['pse', 'pspf1', 'pspf2', 'pspf3', 'psp1', 'psp2', 'psp3']

    # Setando nome para as colunas
    df_features.columns = cols
    
    # Medias dos psp's e pspf's
    df_features['psp'] = df_features[['psp1','psp2','psp3']].apply(lambda x: x.mean(),axis=1)
    df_features['pspf'] = df_features[['pspf1','pspf2','pspf3']].apply(lambda x: x.mean(),axis=1)

    # Dropando colunas que nao sai mais interessantes
    df_features = df_features.drop(columns=['psp1','psp2','psp3','pspf1','pspf2','pspf3'])

    # Aplicando log
    positive_cols = (df_features <= 0).any()
    positive_cols = positive_cols[~positive_cols].index
    df_features.loc[:,positive_cols] = np.log(df_features.loc[:,positive_cols])
    
    return df_features

''' Carrega os modelos de machine learning '''
def load_models():
    
    # Links para acessar modelos
    link1 = 'https://github.com/LucasSugi/data-science/blob/master/AccelerometerAnalysisParkinsonsCannabidiol/Data/model1.pickle?raw=true'
    link2 = 'https://github.com/LucasSugi/data-science/blob/master/AccelerometerAnalysisParkinsonsCannabidiol/Data/model2.pickle?raw=true'
    link3 = 'https://github.com/LucasSugi/data-science/blob/master/AccelerometerAnalysisParkinsonsCannabidiol/Data/model3.pickle?raw=true'

    # Request para link - kmeans1
    response = urlopen(link1)
    f = response.read()
    kmeans1 = pickle.loads(f)

    # Request para link - kmeans2
    response = urlopen(link2)
    f = response.read()
    kmeans2 = pickle.loads(f)

    # Request para link - kmeans3
    response = urlopen(link3)
    f = response.read()
    kmeans3 = pickle.loads(f)
    
    return kmeans1,kmeans2,kmeans3
