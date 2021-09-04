# Cadastro de carro

**RF**
Deve ser possível cadastrar um novo carro

**RN**
Não deve ser possível cadastrar um carro com uma placa já existente.
O carro deve ser cadastrado com disponibilidade imediata, por padrão.
O usuário responsável pelo cadastro deve ser um usuário administrador.

# Listagem de carros

**RF**
Deve ser possível listar todos os carros disponíveis para alugar
Deve ser possível listagem filtrando pelo nome da categoria
Deve ser possível listagem filtrando pelo nome da marca
Deve ser possível listagem filtrando pelo nome do carro

**RN**
Não é necessário um usuário auntenticado no sistema para listar

# Cadastro de especificação do carro

**RF**
Deve ser possível cadastrar uma especificação para um carro


**RN**
Não deve ser possível cadastrar uma especificação para um carro não existente.
Não deve ser possível cadastrar uma especificação já existente para o mesmo carro.
O usuário responsável pelo cadastro deve ser um usuário administrador.


# Cadastro de imagem do carro

**RF**
Deve ser possível cadastrar imagem do carro

**RNF**
Utilizar o multer para upload dos arquivos

**RN**
O usuário deve poder cadastrar mais de uma imagem para o mesmo carro
O usuário responsável pelo cadastro deve ser um usuário administrador.

# Aluguel de carro

**RF**
Deve ser possível cadastrar um aluguel

**RN**
O aluguel deve ter duração mínima de 24 horas
Não deve ser possível cadastrar um novo aluguel caso já exista um em aberto para o mesmo usuário.
Não deve ser possível cadastrar um novo aluguel caso já exista um em aberto para o mesmo carro.
O usuário deve estar logado na aplicação
