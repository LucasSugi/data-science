library(caret)
library(ROCR)
library(pROC)

##########################################################################################

#Constroi a matriz de confusao
confusion_matrix <- function(model,data_frame,type,threshold = 0.5){
    if(type == 'glm'){
        pred = predict(model,newdata=data_frame,type='response')
        pred = ifelse(pred > threshold,1,0)
        return(table(ifelse(pred == 0, 'Pred0','Pred1'),data_frame$censura))
    }
    else if(type == 'caret'){
        pred = predict(model,data_frame,type = 'prob')[[2]]
        pred = ifelse(pred > threshold,1,0)
        return(table(ifelse(pred == 0, 'Pred0','Pred1'),data_frame$censura))
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
roc_curve <- function(model,data_frame,type){
    if(type == 'glm'){
        pred = predict(model,newdata=data_frame,type='response')
    }
    else if(type == 'caret'){
        pred = predict(model,data_frame,type='prob')[[1]]
        pred =  as.numeric(pred)
    }
    curve <- roc(data_frame$censura, pred, percent = TRUE)
    return (curve)
}

##########################################################################################

#Extrai o AUC da curva roc
extract_auc <- function(model,data_frame,type){
    if(type == 'glm'){
        pred = predict(model,newdata=data_frame,type='response')
    }
    else if(type == 'caret'){
        pred = predict(model,data_frame,type='prob')[[1]]
        pred =  as.numeric(pred)
    }
    curve <- roc(data_frame$censura, pred, percent = TRUE)
    return (curve$auc)
}

##########################################################################################

cost <- function(model,data_frame,type,weights){
    if(type == 'glm'){
        curve = roc_curve(model,data_frame,type)
    }
    else if(type == 'caret'){
        curve = roc_curve(model,data_frame,type)
    }
    return (round(coords(curve, x = 'best', best.weights = weights),3))
}