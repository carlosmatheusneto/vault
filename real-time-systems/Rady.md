# Especificação de um Sistema de Tempo Real Distribuído para Detecção e Localização de Vazamentos em Tubulações

**PCS5761 — Especificação de Sistemas de Tempo Real (2026)** Prof. Dr. Jorge Rady de Almeida Jr.

Autor: _[seu nome]_ Data: 1 de setembro de 2026

---

## Resumo

Este trabalho especifica um sistema de tempo real distribuído para detecção e localização de vazamentos em tubulações de longa distância. O sistema é composto por nós sensores dispostos ao longo da tubulação de maneira não uniforme, preferencialmente em distâncias menores que 1 km, que amostram a resposta mecânica/acústica do duto e do meio, comparam leituras para cancelar a interferência ambiental e localizam o vazamento pela diferença de tempo de chegada (TDOA) da perturbação entre nós adjacentes. Argumenta-se que o requisito de tempo real crítico do sistema não é a mera aquisição local, mas a **sincronização temporal entre nós fisicamente separados**, uma vez que o erro de sincronização se converte diretamente em erro de localização. A especificação é desenvolvida segundo o método de engenharia de requisitos para sistemas de tempo real de Laplante & Ovaska, incluindo a modelagem de comportamento por máquinas de estados finitos e redes de Petri, o modelo de tarefas com parâmetros temporais (período, deadline e WCET), a análise de escalonabilidade nos níveis do nó e da rede, e uma discussão dos aspectos de segurança segundo a abordagem de Leveson.

**Palavras-chave:** sistemas de tempo real, sistemas distribuídos, sincronização de relógios, detecção de vazamentos, TDOA, especificação de requisitos, redes de Petri.

---

## 1. Introdução

### 1.1 Contexto e motivação

Tubulações de transporte de fluidos percorrem dezenas ou centenas de quilômetros. Um vazamento não detectado acarreta perdas econômicas, dano ambiental e em casos extremos risco à segurança de pessoas e instalações. Quanto maior o tempo entre a ocorrência e a detecção/localização do vazamento, maior a consequência. Este acoplamento entre _tempo de resposta_ e _magnitude do dano_ é precisamente o que caracteriza o problema como um problema de **sistema de tempo real (STR)**: a correção do sistema não depende apenas de detectar o vazamento, mas de detectá-lo e localizá-lo **dentro de um prazo**.

### 1.2 Objetivo

Especificar, segundo métodos de engenharia de requisitos para sistemas de tempo real, um sistema distribuído capaz de:

1. detectar a ocorrência de um vazamento ao longo de uma tubulação instrumentada;
2. localizar o ponto de vazamento com precisão especificada;
3. garantir os requisitos temporais associados, com destaque para a sincronização temporal entre nós distribuídos.

O produto deste trabalho é o **documento de especificação** do sistema, não sua implementação. A ênfase está na identificação e formalização dos requisitos temporais e no argumento de que eles são satisfazíveis.

### 1.3 Justificativa da escolha do tema

O tema exercita simultaneamente vários eixos da disciplina: engenharia de requisitos e especificação; formas de modelagem (redes de Petri, statecharts); sincronização e transferência de dados; sensores/atuadores e redundância; e risco em STR. Trata-se, portanto, de um estudo de caso rico, que ultrapassa o escopo de um sistema de tempo real _centralizado_ (como o clássico controlador de semáforo) ao introduzir a dimensão **distribuída**: relógios independentes que precisam concordar sobre o tempo através de uma rede de comunicação lenta.

### 1.4 Organização do documento

A Seção 2 estabelece a fundamentação teórica e a terminologia. A Seção 3 descreve o sistema (visão geral do estudo de caso). A Seção 4 apresenta a especificação de requisitos propriamente dita, com os requisitos funcionais, temporais, de comunicação e não-funcionais. A Seção 5 modela formalmente o comportamento (máquina de estados do nó e rede de Petri do protocolo de acesso ao meio e sincronização). A Seção 6 desenvolve a análise de escalonabilidade. A Seção 7 discute segurança e risco. A Seção 8 propõe uma simulação. A Seção 9 conclui.

---

## 2. Fundamentação teórica

### 2.1 Conceitos de tempo real

Um **sistema de tempo real** é aquele cujo funcionamento correto depende não só do resultado lógico da computação, mas também do instante em que esse resultado é produzido (Laplante & Ovaska, Cap. 1). Distinguem-se três classes de restrição temporal:

- **Hard (rígida):** perder o _deadline_ constitui falha do sistema, com consequência potencialmente catastrófica.
- **Firm:** o resultado tardio é inútil, mas não catastrófico; ele é simplesmente descartado.
- **Soft (flexível):** o resultado tardio ainda tem algum valor, apenas degradado.

Parâmetros temporais relevantes de uma tarefa:

- **Período (T):** intervalo de repetição de uma tarefa periódica.
- **Deadline (D):** prazo máximo, contado a partir da ativação, para a conclusão.
- **Tempo de execução no pior caso (WCET, C):** limite superior do tempo de processamento.
- **Jitter:** variação no instante de ativação ou de término.
- **Determinismo:** propriedade de o sistema apresentar comportamento temporal previsível.

A **utilização** de uma tarefa periódica é U = C/T, e a utilização do processador é a soma das utilizações das tarefas.

### 2.2 Escalonamento

Quando várias tarefas disputam o processador, uma política de escalonamento define a ordem de execução. Duas abordagens clássicas (Laplante & Ovaska, Cap. 3):

- **Rate-Monotonic (RM):** prioridades fixas atribuídas na razão inversa do período (menor período → maior prioridade). Um conjunto de _n_ tarefas independentes é escalonável se a utilização total não exceder o limite de Liu & Layland U ≤ n·(2^(1/n) − 1), que tende a ln 2 ≈ 0,693 quando n → ∞. O teste é suficiente, não necessário.
- **Earliest-Deadline-First (EDF):** prioridades dinâmicas; executa-se a tarefa cujo deadline está mais próximo. É ótimo para um processador e escalonável se e somente se U ≤ 1.
- **Executivo cíclico (cyclic executive):** escalonamento disparado por tempo (_time-triggered_), em que uma tabela pré-calculada determina o que executa em cada instante. É adequado a sistemas cujas ativações devem ocorrer em instantes precisos — como a amostragem sincronizada deste trabalho.

### 2.3 Análise de tempo de resposta

Além do teste de utilização, o **tempo de resposta no pior caso** R_i de uma tarefa sob prioridade fixa pode ser obtido pela recorrência (Laplante & Ovaska, Cap. 7):

R_i = C_i + Σ_{j ∈ hp(i)} ⌈R_i / T_j⌉ · C_j

onde hp(i) é o conjunto de tarefas de maior prioridade que i. A tarefa é escalonável se R_i ≤ D_i.

### 2.4 Sincronização de relógios distribuídos

Em um sistema distribuído, cada nó possui um oscilador próprio. Dois relógios inicialmente acertados divergem ao longo do tempo (fenômeno de **drift**), tipicamente na ordem de dezenas de partes por milhão (ppm) para osciladores de cristal comuns. Sincronizar significa manter o desvio entre quaisquer dois relógios abaixo de uma tolerância Δ. Dois mecanismos principais:

- **Referência de tempo absoluto por GNSS/PPS:** cada nó recebe de um receptor de satélite o sinal _Pulse-Per-Second_ (PPS), com precisão da ordem de dezenas de nanossegundos, e disciplina seu relógio local por ele. Vantagem: precisão altíssima e independência da rede. Restrição: exige visada de céu (a antena fica na superfície; apenas o transdutor fica enterrado).
- **Sincronização pela própria rede:** um nó de referência difunde periodicamente quadros de sincronização (_beacons_), e os demais corrigem seus relógios; em topologias multi-salto, a correção propaga-se salto a salto (redes em malha). Protocolos clássicos em redes de sensores sem fio: FTSP, TPSN e RBS. Em LoRa, o modo Classe B do LoRaWAN provê _beacons_ periódicos. Vantagem: dispensa GNSS em cada nó. Restrição: a precisão é limitada pela latência e variabilidade do meio.

> **Nota de escopo.** A sincronização de relógios distribuídos está além do foco central do texto de Laplante & Ovaska, que trata predominantemente de sistemas monoprocessados. Este aspecto é, portanto, tratado como uma **extensão** do estudo de caso, apoiada em bibliografia complementar (protocolos FTSP/PTP e LoRaWAN Classe B). O conceito local mais próximo no texto-base é o de _time-relative buffering_ (Laplante & Ovaska, Cap. 3), usado adiante para o alinhamento das amostras.

### 2.5 Formas de modelagem

O comportamento de sistemas reativos de tempo real pode ser especificado por:

- **Máquinas de estados finitos (FSM)** e **statecharts** (Harel): descrevem os estados de um componente e as transições disparadas por eventos e temporizadores.
- **Redes de Petri:** especialmente adequadas à modelagem de **concorrência, sincronização e exclusão mútua**, propriedades centrais neste sistema (múltiplos nós compartilhando um meio de r.f.).

---

## 3. Descrição geral do sistema (estudo de caso)

### 3.1 Princípio de funcionamento

Um vazamento em uma tubulação pressurizada gera uma perturbação mecânica (onda de pressão / emissão acústica) que se propaga ao longo do duto a uma velocidade v_p da ordem de centenas a ~1200 m/s, dependendo do fluido e do material. Detectando-se a passagem dessa perturbação em dois pontos instrumentados e conhecendo-se os instantes de chegada t_A e t_B em nós adjacentes, a posição do vazamento é obtida por **diferença de tempo de chegada (TDOA)**:

x = ( L − v_p·(t_B − t_A) ) / 2

onde L é a distância entre os nós A e B. Observa-se que a diferença (t_B − t_A) só tem significado se t_A e t_B forem medidos contra uma **base de tempo comum** — daí a centralidade da sincronização.

### 3.2 Arranjo de sensores por nó

Cada nó dispõe de **dois transdutores**:

- **Sensor 1** — acoplado à parede da tubulação: capta o sinal do vazamento somado à interferência do meio.
- **Sensor 2** — enterrado no solo adjacente: capta predominantemente a interferência do meio (vibração de tráfego, ruído ambiental).

A subtração das duas leituras (após alinhamento temporal) **cancela a interferência do meio**, realçando a assinatura do vazamento. Como ambos os transdutores pertencem ao mesmo nó e compartilham o mesmo microcontrolador e o mesmo relógio local, sua sincronização mútua é trivial (amostragem disparada pelo mesmo temporizador). O problema difícil é a sincronização **entre nós**.

### 3.3 Topologia

Nós idênticos são dispostos a cada **1 km** ao longo da tubulação. Cada nó comunica-se por rádio **LoRa** de longo alcance com os nós vizinhos e/ou com um _gateway_, formando uma rede possivelmente **multi-salto (malha)**. Um nó de referência (ou o _gateway_) provê a referência de sincronização.

### 3.4 Componentes de um nó

- Dois transdutores + condicionamento de sinal + conversor A/D.
- Microcontrolador com temporizador de alta resolução.
- Rádio LoRa.
- Fonte de sincronização temporal: **[CONFIRMAR — escolher entre (a) receptor GNSS/PPS por nó ou (b) sincronização por _beacon_ da rede]**. A escolha decorre do valor de Δ exigido (ver Seção 4.2).

---

## 4. Especificação de requisitos

Convenção: cada requisito recebe um identificador rastreável. **RF** = requisito funcional; **RT** = requisito temporal; **RC** = requisito de comunicação; **RNF** = requisito não-funcional.

### 4.1 Requisitos funcionais

- **RF-01.** O nó deve amostrar continuamente os dois transdutores e manter uma janela recente das amostras.
- **RF-02.** O nó deve subtrair, após alinhamento temporal, o sinal do Sensor 2 do sinal do Sensor 1, produzindo o sinal compensado.
- **RF-03.** O nó deve detectar, no sinal compensado, o evento característico de passagem da perturbação de vazamento (limiar/assinatura).
- **RF-04.** Ao detectar o evento, o nó deve registrar o **instante de chegada** com carimbo temporal referido à base de tempo global.
- **RF-05.** O nó deve transmitir o carimbo temporal e os metadados do evento aos nós vizinhos / _gateway_.
- **RF-06.** O sistema deve, de posse dos instantes de chegada de dois nós adjacentes, calcular a posição do vazamento por TDOA (Seção 3.1).
- **RF-07.** O sistema deve sinalizar um alarme de vazamento, com a localização estimada, ao centro de operação.
- **RF-08.** O sistema deve reportar periodicamente a saúde de cada nó (_heartbeat_), permitindo detectar nós inoperantes.

### 4.2 Requisitos temporais (núcleo do sistema)

O requisito temporal determinante é a **sincronização entre nós**. Deriva-se seu valor a partir da precisão de localização desejada. Da relação de TDOA, um erro de sincronização δt entre dois nós produz um erro de localização δx = v_p·δt / 2. Para v_p ≈ 1000 m/s:

|Precisão de localização desejada (δx)|Erro de sincronização admissível (Δ)|
|---|---|
|1 m|≈ 2 ms|
|0,5 m|≈ 1 ms|
|0,1 m|≈ 200 µs|

- **RT-01 (crítico, hard).** O desvio entre o relógio de qualquer nó e a base de tempo global deve permanecer **≤ Δ**, com **Δ = 1 ms** _[CONFIRMAR — decorre da precisão-alvo de 0,5 m adotada; ajustar conforme a especificação de projeto]_. Este é o requisito que caracteriza o sistema como de tempo real distribuído.
- **RT-02 (hard).** A tarefa de aquisição (A/D) deve executar com período T = 1 ms e deadline D = 1 ms (taxa de amostragem de 1 kHz) _[CONFIRMAR conforme a banda do sinal de interesse; emissão acústica de alta frequência exigiria taxa maior]_.
- **RT-03 (hard).** O carimbo temporal do evento (RF-04) deve ser registrado em até **0,5 ms** após a detecção, para não introduzir erro adicional comparável a Δ.
- **RT-04 (firm).** A detecção/pré-processamento local (RF-02, RF-03) deve concluir em até 100 ms por janela.
- **RT-05 (hard).** A correção de sincronização de relógio deve ser aplicada a cada 1 s, com execução concluída em até 50 ms após a recepção do _beacon_, mantendo RT-01 mesmo sob o _drift_ máximo do oscilador _[CONFIRMAR período em função do drift especificado do cristal]_.
- **RT-06 (soft).** O alarme de vazamento (RF-07) deve chegar ao centro de operação em até **[CONFIRMAR — p.ex. 5 s]** após a detecção.

### 4.3 Requisitos de comunicação (acesso ao meio)

Como o meio de rádio é compartilhado, transmissões simultâneas de nós distintos colidem e destroem os dados. Adota-se **TDMA (Time Division Multiple Access)**: o tempo é dividido em _slots_, e cada nó transmite apenas em seu _slot_. Observação de projeto: o TDMA **requer** relógios sincronizados — de modo que a sincronização exigida por RT-01 serve, simultaneamente, para organizar o acesso ao meio (uma solução resolve dois problemas).

- **RC-01.** Cada nó transmite exclusivamente em seu _slot_ de tempo, referenciado à base de tempo global.
- **RC-02.** Cada _slot_ inclui um **tempo de guarda** de pelo menos 2·Δ mais o atraso de propagação, para absorver o erro residual de sincronização e evitar sobreposição entre _slots_ adjacentes.
- **RC-03.** O ciclo TDMA completo (todos os nós de um segmento) deve caber dentro da latência de reporte exigida por RT-06.
- **RC-04.** A perda de um quadro não deve comprometer a detecção: o evento é retransmitido no próximo ciclo, ou detectado por redundância entre nós vizinhos.

### 4.4 Requisitos não-funcionais

- **RNF-01 (confiabilidade).** A falha de um nó isolado não deve impedir a detecção de vazamentos em segmentos cobertos por nós vizinhos (degradação graciosa).
- **RNF-02 (tolerância a falhas).** O sistema deve detectar nós silenciosos (ausência de _heartbeat_, RF-08) em até **[CONFIRMAR]** e sinalizá-los como indisponíveis.
- **RNF-03 (disponibilidade).** Operação contínua; nós alimentados por bateria/energia solar devem gerir consumo (o ciclo de trabalho do LoRa e da aquisição impacta a autonomia).
- **RNF-04 (manutenibilidade).** Nós devem permitir atualização de parâmetros (limiar de detecção, Δ, alocação de _slots_) sem substituição de hardware.

---

## 5. Modelagem formal

### 5.1 Máquina de estados do nó

O comportamento de cada nó é descrito pela seguinte máquina de estados finitos. (Diagrama a ser desenhado para a apresentação; a tabela abaixo o especifica integralmente.)

**Estados:** `INICIALIZAÇÃO`, `SINCRONIZANDO`, `MONITORANDO`, `EVENTO_DETECTADO`, `TRANSMITINDO`, `FALHA`.

|Estado atual|Evento / condição|Próximo estado|Ação|
|---|---|---|---|
|INICIALIZAÇÃO|_boot_ concluído|SINCRONIZANDO|inicia rádio e relógio|
|SINCRONIZANDO|_beacon_ recebido e \|desvio\| ≤ Δ|MONITORANDO|disciplina o relógio local|
|SINCRONIZANDO|_timeout_ de _beacon_|FALHA|sinaliza perda de sincronização|
|MONITORANDO|perturbação acima do limiar no sinal compensado|EVENTO_DETECTADO|registra t_chegada (carimbo global)|
|MONITORANDO|chegada do próprio _slot_ TDMA|TRANSMITINDO|envia _heartbeat_/dados|
|MONITORANDO|_drift_ → \|desvio\| > Δ iminente|SINCRONIZANDO|reagenda ressincronização|
|EVENTO_DETECTADO|carimbo registrado|TRANSMITINDO|prepara quadro de evento|
|TRANSMITINDO|transmissão concluída|MONITORANDO|retorna ao monitoramento|
|FALHA|reinício / recuperação|INICIALIZAÇÃO|—|

A restrição temporal RT-01 aparece como a **condição de guarda** que separa `SINCRONIZANDO` de `MONITORANDO`: o nó só monitora enquanto seu desvio é ≤ Δ. Esta é a formalização, em nível de comportamento, do requisito crítico do sistema.

### 5.2 Rede de Petri do acesso ao meio (TDMA) e sincronização

A rede de Petri modela a **exclusão mútua** no acesso ao meio de rádio, garantindo que apenas um nó transmita por vez, e a natureza cíclica dos _slots_.

**Lugares (places):** `P_token` (permissão de transmissão — o _slot_ corrente), `P_pronto_i` (nó _i_ com dado a transmitir), `P_transmitindo_i`, `P_ocioso_i`.

**Transições:** `t_captura_i` (nó _i_ adquire o token no seu slot), `t_libera_i` (nó _i_ devolve o token ao fim do slot).

**Invariante de segurança (mutex):** o número de _tokens_ em `P_token` mais a soma dos `P_transmitindo_i` é constante e igual a 1 — ou seja, **no máximo um nó transmite simultaneamente**. Esta é a propriedade que a rede de Petri torna verificável formalmente. A sincronização global (RT-01) é o que garante que a passagem do _token_ de um _slot_ ao seguinte ocorra de forma consistente entre nós que não compartilham relógio físico.

_(Diagrama da rede a ser produzido para a apresentação.)_

---

## 6. Análise de escalonabilidade

### 6.1 Nível do nó (processador local)

Modelo de tarefas de um nó (valores propostos, _[CONFIRMAR]_):

|Tarefa|Tipo|Período T|Deadline D|WCET C|Criticidade|U = C/T|
|---|---|---|---|---|---|---|
|Aquisição A/D|periódica|1 ms|1 ms|0,15 ms|hard|0,150|
|Carimbo temporal|esporádica|(≥ 20 ms)*|0,5 ms|0,05 ms|hard|—|
|Detecção / pré-proc.|periódica|100 ms|100 ms|20 ms|firm|0,200|
|Sincronização de relógio|periódica|1000 ms|50 ms|5 ms|hard|0,005|

* A tarefa de carimbo é disparada por evento (esporádica); adota-se um intervalo mínimo entre ativações para efeito de análise.

**Teste de utilização (RM).** Considerando as tarefas periódicas, U_total ≈ 0,150 + 0,200 + 0,005 = **0,355**. O limite de Liu & Layland para n = 3 é 3·(2^(1/3) − 1) ≈ **0,780**. Como 0,355 < 0,780, o conjunto é **escalonável por Rate-Monotonic** (teste suficiente). Mesmo somando a contribuição da tarefa esporádica de carimbo, a margem é ampla. Conclui-se que o processamento local **não é o gargalo** do sistema.

### 6.2 Nível da rede (meio compartilhado)

Seja `t_ar` o tempo no ar de um quadro LoRa (dependente do _spreading factor_, banda e tamanho de _payload_) e `t_guarda` = 2·Δ + t_propagação o tempo de guarda por _slot_. O comprimento de um _slot_ é t_slot = t_ar + t_guarda, e o ciclo TDMA de N nós é:

T_ciclo = N · (t_ar + t_guarda)

Exemplo _[CONFIRMAR os valores de LoRa conforme SF/BW escolhidos]_: com t_ar ≈ 200 ms, Δ = 1 ms (t_guarda ≈ 2 ms + propagação desprezível), t_slot ≈ 202 ms. Para atender a uma latência de reporte de 5 s (RT-06), o número de nós por ciclo satisfaz:

N · 202 ms ≤ 5000 ms ⇒ **N ≤ 24 nós por segmento/ciclo**.

Este é o resultado de **escalonabilidade da rede**: ele dimensiona quantos nós um segmento suporta antes que a latência de reporte seja violada, e mostra o _trade-off_ direto entre o _spreading factor_ do LoRa (que aumenta t_ar e o alcance) e a capacidade de nós. Segmentos maiores exigem particionamento em sub-redes com _gateways_ adicionais.

### 6.3 Síntese

- O gargalo do sistema **não** é o processamento local (folga ampla em RM), mas a **capacidade do meio de rádio** e, sobretudo, a **manutenção de RT-01** (sincronização ≤ Δ) sob _drift_ dos osciladores. A escolha do mecanismo de sincronização (GNSS/PPS vs. _beacon_) é, portanto, a decisão de projeto de maior impacto.

---

## 7. Segurança e risco

Seguindo a perspectiva de Leveson (_Safeware_), a segurança de um sistema como este não é uma propriedade de um componente isolado, mas emerge das interações. Alguns perigos e mitigações:

- **Falso negativo (vazamento não detectado):** o perigo mais grave. Mitigação: redundância entre nós adjacentes (RNF-01), monitoramento de _heartbeat_ (RF-08) para não confundir nó falho com ausência de vazamento.
- **Erro de localização por perda de sincronização:** se um nó opera com desvio > Δ sem se dar conta, a localização fica errada. Mitigação: a condição de guarda da máquina de estados (Seção 5.1) força o nó a sair de `MONITORANDO` quando o desvio é iminente; o carimbo carrega a qualidade da sincronização.
- **Falso positivo (alarme espúrio):** custo operacional e perda de confiança. Mitigação: exigência de coincidência entre nós vizinhos e a assinatura no sinal compensado.

A natureza crítica do domínio justifica a classificação **hard** dos requisitos RT-01 a RT-03 e RT-05: um resultado de localização tardio ou dessincronizado é, na prática, um resultado errado.

---

## 8. Proposta de simulação

Para o componente de simulação do trabalho, propõe-se demonstrar **um** dos seguintes (o de maior valor demonstrativo é o primeiro):

1. **Sincronização sob drift:** simular dois relógios com _drift_ aleatório e o mecanismo de correção por _beacon_, mostrando que o desvio permanece ≤ Δ ao longo do tempo, e o que ocorre quando o período de ressincronização (RT-05) é insuficiente. Métrica: erro de sincronização máximo vs. período de _beacon_.
2. **TDMA sem colisão:** simular N nós transmitindo em _slots_ e verificar ausência de colisão, medindo a latência de reporte em função de N (validando a Seção 6.2).
3. **Localização por TDOA:** simular a propagação da onda e a estimativa de posição, mostrando como o erro de sincronização δt se propaga para o erro de localização δx.

---

## 9. Conclusão

Especificou-se um sistema de tempo real distribuído para detecção e localização de vazamentos em tubulações. O trabalho identificou que o requisito de tempo real determinante não é a aquisição local — cujo escalonamento apresenta folga ampla — mas a **manutenção do erro de sincronização entre nós distribuídos abaixo de uma tolerância Δ**, derivada diretamente da precisão de localização desejada. A partir desse requisito central, especificaram-se os requisitos funcionais, temporais, de comunicação e não-funcionais; modelou-se o comportamento por máquina de estados (com a condição de sincronização como guarda) e o acesso ao meio por rede de Petri (com invariante de exclusão mútua); e analisou-se a escalonabilidade nos níveis do nó (Rate-Monotonic) e da rede (dimensionamento TDMA). A abordagem seguiu o método de especificação de Laplante & Ovaska, estendido, no aspecto de sincronização distribuída, por bibliografia complementar.

---

## Referências

- LAPLANTE, P. A.; OVASKA, S. J. _Real-Time Systems Design and Analysis: Tools for the Practitioner_. 4. ed. Wiley/IEEE Press.
- BURNS, A.; WELLINGS, A. _Real-Time Systems and Programming Languages_. 4. ed. Addison-Wesley.
- LEVESON, N. G. _Safeware: System Safety and Computers_. Addison-Wesley.
- HATLEY, D.; PIRBHAI, I. _Strategies for Real-Time System Specification_. McGraw-Hill, 1991.
- SOMMERVILLE, I. _Engenharia de Software_. 8. ed. Pearson.
- LIU, C. L.; LAYLAND, J. W. Scheduling algorithms for multiprogramming in a hard-real-time environment. _Journal of the ACM_, 1973.
- _[Complementar — sincronização distribuída]_ MARÓTI, M. et al. The Flooding Time Synchronization Protocol (FTSP). _SenSys_, 2004.
- _[Complementar — LoRaWAN Classe B / beacons]_ LoRa Alliance. _LoRaWAN Specification_.

---

_Observação sobre pontos marcados [CONFIRMAR]: são parâmetros de projeto que você deve fixar e saber justificar na apresentação. Os valores propostos são internamente consistentes e defensáveis, mas ajuste-os conforme a precisão-alvo, o tipo de sinal e os parâmetros de LoRa que você adotar._