library(reshape2)
library(caret)
library(ROCR)
library(ggplot2)
library(readxl)
library(glmnet)
library(pROC)

#Leitura do dataset e aplicação das informações obtidas na análise exploratória
read_dataset <- function(split=TRUE){
    #Leitura do dataset
    data_frame = read_excel('Base4.xls',sheet = 'dadosCredito')
    
    #Mudando nome de colunas
    colnames(data_frame) = c('idade','educacao','t_emprego','t_endereco','renda','divida','divida_cc','outras_div','default')
    
    #Transformando colunas para factor
    data_frame$educacao = as.factor(data_frame$educacao)
    data_frame$default = as.factor(data_frame$default)
    
    #Aplicando log
    data_frame$renda = log(data_frame$renda)
    data_frame$outras_div = log(data_frame$outras_div)
    data_frame$divida_cc = log(data_frame$divida_cc)
    
    #Criando nova variavel
    data_frame$div = data_frame$divida_cc + data_frame$outras_div
    
    #Intervalando educacao
    data_frame$educacao = sapply(data_frame$educacao,function(x){
        if(x == 4 || x == 5){
            return (3)
        }
        return (x)
    })
    
    #Padronização do dataset (pode ajudar na regressao logistica)
    minDf = apply(data_frame[c(1,3,4,5,6,7,8,10)],2,min)
    sdDf = apply(data_frame[c(1,3,4,5,6,7,8,10)],2,sd)
    newDf = apply(data_frame[c(1,3,4,5,6,7,8,10)],1,function(x){
        return (round(((x-minDf)/sdDf),2))
    })
    data_frame[c(1,3,4,5,6,7,8,10)] = t(newDf)
    
    #Vamos definir as pessoas inadimplentes como 1  (Positivo) e adimplentes como 0 (Negativo)
    data_frame$default = sapply(data_frame$default,function(x){
        if(x == 1){
            return (0)
        }
        return (1)
    })
    data_frame$default = as.factor(data_frame$default)
    
    if(split){
        #Separando dados em treino e teste de forma balanceada
        return (samples(data_frame))
    }
    else{
        return (data_frame)
    }
}

##########################################################################################

#Realiza amostragem em um data.frame de forma balanceada
samples <- function(data_frame){
    class_perc = summary(data_frame$default)
    probs_1 = round(class_perc[1]/(class_perc[1]+class_perc[2]),2)
    probs_2 = 1-probs_1
    probs = sapply(data_frame$default,function(x){
        if(x == 0){
            return(probs_2)
        }
        else{
            return (probs_1)
        }
    })
    sp = sample(rep(1:nrow(data_frame)),size=300,prob=probs)
    data = list()
    data$train = data_frame[sp,]
    data$test = data_frame[-sp,]
    return(data)
}

##########################################################################################

#Constroi a matriz de confusao
confusion_matrix <- function(model,data_frame,type,threshold = 0.5){
    if(type == 'glm'){
        pred = predict(model,newdata=data_frame,type='response')
        pred = ifelse(pred > threshold,1,0)
        return(table(ifelse(pred == 0, 'Pred0','Pred1'),data_frame$default))
    }
    else if(type == 'reg'){
        newx = model.matrix(default ~ ., data = data_frame)[, -1]
        pred = predict(model, newx = newx, s = model$lambda.min, type = 'response')
        pred = ifelse(pred > threshold,1,0)
        return(table(ifelse(pred == 0, 'Pred1','Pred0'),data_frame$default))
    }
    else if(type == 'knn'){
        pred = predict(model,data_frame,type = 'prob')[[2]]
        pred = ifelse(pred > threshold,1,0)
        return(table(ifelse(pred == 0, 'Pred0','Pred1'),data_frame$default))
    }
}

#Métricas da matriz de confusao
metric_confusion_matrix <- function(confMat){
    metric = list()
    diag = diag(confMat)
    metric$accuracy = round((sum(diag) / sum(confMat)),3)
    metric$sens = round(confMat[2,2] / sum(confMat[,2]),3)
    metric$espec = round(confMat[1,1] / sum(confMat[,1]),3)
    return(metric)
}

##########################################################################################

#Constroi a curva roc
roc_curve <- function(model,data_frame,save=FALSE,type){
    if(type == 'glm'){
        pred = predict(model,newdata=data_frame,type='response')
    }
    else if(type == 'reg'){
        newx = model.matrix(default ~ ., data = data_frame)[, -1]
        pred = predict(model, newx = newx, s = model$lambda.min, type = 'response')
        pred = as.vector(pred)
    }
    else if(type == 'knn'){
        pred = predict(model,data_frame,type='prob')[[1]]
        pred =  as.numeric(pred)
    }
    curve <- roc(data_frame$default, pred, percent = TRUE)
    
    if(save){
        png('roc.png')
        plot(curve)
        dev.off()
    }
    else{
        plot(curve)
    }
}

##########################################################################################

#Extrai o AUC da curva roc
extract_auc <- function(model,data_frame,type){
    if(type == 'glm'){
        pred = predict(model,newdata=data_frame,type='response')
    }
    else if(type == 'reg'){
        newx = model.matrix(default ~ ., data = data_frame)[, -1]
        pred = predict(model, newx = newx, s = model$lambda.min, type = 'response')
        pred = as.vector(pred)
    }
    else if(type == 'knn'){
        pred = predict(model,data_frame,type='prob')[[1]]
        pred =  as.numeric(pred)
    }
    curve <- roc(data_frame$default, pred, percent = TRUE)
    return (curve$auc)
}

##########################################################################################