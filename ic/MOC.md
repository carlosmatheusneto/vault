EKF : mantém duas coisas - estimativa de estado e uma matriz de covariância(o quanto ele confia nessa estimativa). Loop de 2 passos: 

Predict - a cada tick do tempo ele propaga o estado pra frente no tempo usando um modelo cinemático interno (posição integra velocidade, velocidade integra aceleração). Nesse passo a covariância cresce