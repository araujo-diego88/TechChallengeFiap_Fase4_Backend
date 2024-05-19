# Shared Spaces

## Descrição basica
Fase 4 do Tech Challenge da Pos tech FIAP - GRUPO D 

Será desenvolvido um sistema de reservas online que disponibiliza espaços compartilhados como: salões de festas, quadras esportivas, salas de reuniões e etc... 

No repositório será criada a parte de backend e conexão com o banco de dados, alem do frontend para interagir com a interface

Será possível gerenciar as opções de reservas como: 
- Adicionar;
- Vizualizar;
- Cancelar.

## Escopo
Somos uma empresa que disponibiliza espaços compartilhados como salas de reunião, quadras esportivas e salões de festa para locação por seus membros, que podem reservar os espaços para realização de eventos pessoais e profissionais. Todavia, atualmente o processo de reservas é realizado por sistemas manuais e de baixa tecnologia, o que leva a conflitos de agendamento, má utilização de recursos e a insatisfação geral entre os usuários.

A solução proposta foi a criação do Sistema de Reservas Online simplificado, que permitirá aos usuários consultar os espaços disponíveis, reservar horários, e gerir suas reservas, tudo por meio de um sistema online unificado e eficiente, que apresente uma interface amígavel e fácil de manusear.

## Análise e desenvolvimento
Diante das funcionalidades exigidas pelo projeto, optou-se pelo desenvolvimento do Sistema de Reservas Online como um aplicativo web, modelado na arquitetura MVC (Model – View – Controller). 

O back-end do aplicativo foi desenvolvido por meio do Express.js, framework para desenvolvimento web do Node.js., que fornece todas as ferramentas necessárias para roteamento e conexão com o banco de dados. A interface do usuário também foi construída com auxílio de um framework, o Bootstrap, para gerar páginas web com HTML e CSS que são responsivas e atraentes. Por fim, o MongoDB foi escolhido como o database para armazenar os dados do sistema, pela sua habilidade de receber e processar informações por meio de requisições HTTP. 

Desta forma, todos os componentes do front e do back-end do aplicativo podem funcionar de forma integrada, servindo informações aos usuários em tempo real por meio da internet.

## Funcionalidade básica
Para inicializar o projeto, primeiro certifique-se que o seu sistema é compatível com o Node.js v20.12.0 ou superior. Utilizando comandos de linha, navegue para o diretório do projeto e execute o seguinte comando: **npm run dev** ou **npm start**

## Banco de dados
A carga inicial de dados do projeto está salva em um database do MongoDB, a qual está organizada em três tabelas: places, reserves e users.

A tabela places guarda informações relacionadas aos espaços disponíveis para reserva, e contém as seguintes colunas:
-	_id (identificador único);
-	nome;
-	thumbnail (imagem do local);
-	description (descrição resumida do espaço);
-	descricao_longa (descrição detalhada do local);
-	preço (preço para aluguel do espaço, por pessoa); 
-	location (endereço do local); 
-	datas_disponiveis (array contendo datas em que o espaço está disponível para locação);
-	user (ID do usuário que acrescentou o espaço).

A tabela reserves capta as informações das reservas feitas por meio do aplicativo web, com as colunas:
-	_id (identificador único);
-	date (data e hora reservados);
-	user (ID do usuário que fez a reserva);
-	place (ID do espaço reservado);
-	num_pessoas (número de pessoas informado na reserva).

Por derradeiro, a tabela users guarda os registros dos usuários cadastrados, contendo as colunas que seguem:
-	_id (identificador único);
-	nome (nome completo do usuário fornecido no cadastro);
-	data_nascimento (data de nascimento do usuário);
-	data_cadastro (data em que o usuário realizou seu cadastro);
-	username (informado no cadastro);
-	email;
-	password;
-	isAdmin (campo que recebe um valor booleano para identificar os usuários com privilégios administrativos).


