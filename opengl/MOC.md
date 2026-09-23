OPENGL job is to transform 3D cordinates into 2D pixels

Pipeline can be divided into two major parts: the first trnasforms 3d into 2d cordinates, and the second one transform 2d cordinates into colorfull pixels

A primeira coisa que vamos fazer é : declarar os vértices que vamos colocar na pipeline. Basicamente, a gente vai alocar os dados na RAM (os vértices) e dps enviar esses dados pra VRAM da GPU. Pra fazer esse envio vamos utilizar o VBO(buffer - o espaço na memória da GPU). Vale ressaltar que esse processo de enviar dados da RAM pra VRAM é lento, logo queremos enviar o máximo de vértices de uma vez(obviamente sem prejudicar a memoria da GPU)

```cpp
unsigned int VBO; glGenBuffers(1, &VBO); // cria o buffer e te dá um ID (ainda vazio) 
glBindBuffer(GL_ARRAY_BUFFER, VBO); // "é com esse buffer que vou mexer agora" 
glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW); //Aqui é onde acontece a cópia pra RAM da GPU
//- GL_STREAM_DRAW: os dados são definidos apenas uma vez e usados pela GPU no máximo algumas vezes.
//- GL_STATIC_DRAW: os dados são definidos apenas uma vez e utilizados muitas vezes.
//- GL_DYNAMIC_DRAW: os dados são muito alterados e usados muitas vezes.
```