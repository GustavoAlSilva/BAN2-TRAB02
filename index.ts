import readline from 'readline';
import Estado from './src/nodes/Estado';
import Cidade from './src/nodes/Cidade';
import Pessoa from './src/nodes/Pessoa';
import Solicitante from './src/nodes/Solicitante';
import Condutor from './src/nodes/Condutor';
import Deposito from './src/nodes/Deposito';
import Alimento from './src/nodes/Alimento';
import ArrecadacaoAlimento from './src/nodes/ArrecadacaoAlimento';
import EstoqueAlimento from './src/nodes/EstoqueAlimento';
import DoacaoAlimento from './src/nodes/DoacaoAlimento';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function pergunta(entrada: string): Promise<string> {

    return new Promise((resolve) => {

        rl.question(entrada, (resposta) => {

            resolve(resposta.trim());
        });
    });
}

const menuInicial = `
    Escolha uma das opções abaixo:

    [1] - Estado;
    [2] - Cidade;
    [3] - Pessoa;
    [4] - Solicitante;
    [5] - Condutor;
    [6] - Depósito;
    [7] - Alimento;
    [8] - Arrecadação de alimento;
    [9] - Estoque de alimento;
    [10] - Doação de alimento;

    [11] - Mostrar as pessoas associadas aos depósitos e suas cidades;
    [12] - Mostrar quantidade total arrecadada de cada alimento;
    [13] - Mostrar total de doações recebidas por solicitante (KGs de alimentos);

    [14] - Sair.
`;

const menuExecucao = `
    Você deseja:

    [1] - Inserir;
    [2] - Listar todos;
    [3] - Mostrar;
    [4] - Editar;
    [5] - Deletar;
    [6] - Sair.
`;

let uf, nome, estado, opcaoExecutar, cidade, ufEstado, cidades, id, pessoa, cpf, sobrenome, data_nascimento, idCidade, bairro, cep, logradouro, numeroResidencial, ddd, telefone, email, pessoas, solicitante, quantidadeDependentes, solicitantes, cnh, condutores, condutor, deposito, depositos, idPessoa, alimento, alimentos, descricao, arrecadacoesAlimento, arrecadacaoAlimento, dataValidade, peso, idDeposito, idAlimento, idCondutor, estoqueAlimento, estoquesAlimento, doacaoAlimento, doacoesAlimento, idSolicitante, idEstoqueAlimento, resultados;

(async () => {

    let opcaoInicial;

    do {

        opcaoInicial = await pergunta(menuInicial);

        switch (opcaoInicial) {
            case '1':
                opcaoExecutar = await pergunta(menuExecucao);

                switch (opcaoExecutar) {
                    case '1':
                        uf = await pergunta('Digite a UF do estado: ');
                        nome = await pergunta('Digite o nome do estado: ');

                        estado = {
                            uf: uf,
                            nome: nome
                        };

                        await Estado.create(estado);
                        break;
                    case '2':
                    const estados = await Estado.getAll();

                        for (const estado of estados) {

                            for (const chave in estado) {

                                console.log(`${chave}: ${estado[chave]}`);
                            }

                            console.log('\n');
                        }
                        break;
                    case '3':
                        uf = await pergunta('Digite a UF do estado: ');

                        estado = await Estado.getOne(uf);

                        for (const chave in estado) {

                            console.log(`${chave}: ${estado[chave]}`);
                        }
                        break;
                    case '4':
                        uf = await pergunta('Digite a UF do estado: ');
                        nome = await pergunta('Digite o nome do estado: ');

                        estado = { nome: nome };

                        await Estado.update(uf, estado);
                        break;
                    case '5':
                        uf = await pergunta('Digite a UF do estado: ');

                        await Estado.delete(uf);
                        break;
                    case '6':
                        break;
                    default:
                        console.log('Opção inválida');
                        break;
                }
                break;
            case '2':
                opcaoExecutar = await pergunta(menuExecucao);

                switch (opcaoExecutar) {
                    case '1':
                        ufEstado = await pergunta('Digite a UF do estado da cidade: ');
                        nome = await pergunta('Digite o nome da cidade: ');

                        cidade = {
                            estadoUf: ufEstado,
                            nome: nome
                        };

                        await Cidade.create(cidade);
                        break;
                    case '2':
                    cidades = await Cidade.getAll();

                        for (const cidade of cidades) {

                            for (const chave in cidade) {

                                console.log(`${chave}: ${cidade[chave]}`);
                            }

                            console.log('\n');
                        }
                        break;
                    case '3':
                        id = await pergunta('Digite o ID da cidade: ');

                        cidade = await Cidade.getOne(id);

                        for (const chave in cidade) {

                            console.log(`${chave}: ${cidade[chave]}`);
                        }
                        break;
                    case '4':
                        id = await pergunta('Digite o ID da cidade: ');
                        ufEstado = await pergunta('Digite a UF do estado da cidade: ');
                        nome = await pergunta('Digite o nome da cidade: ');

                        cidade = { nome: nome, estadoUf: ufEstado };

                        await Cidade.update(id, cidade);
                        break;
                    case '5':
                        id = await pergunta('Digite o ID da cidade: ');

                        await Cidade.delete(id);
                        break;
                    case '6':
                        break;
                    default:
                        console.log('Opção inválida');
                        break;
                }
                break;
            case '3':
                opcaoExecutar = await pergunta(menuExecucao);

                switch (opcaoExecutar) {
                    case '1':
                        cpf = await pergunta('Digite o CPF da pessoa: ');
                        nome = await pergunta('Digite o nome da pessoa: ');
                        sobrenome = await pergunta('Digite o sobrenome da pessoa: ');
                        data_nascimento = await pergunta('Digite a data de nascimento da pessoa: ');
                        idCidade = await pergunta('Digite o ID da cidade da pessoa: ');
                        bairro = await pergunta('Digite o bairro da pessoa: ');
                        cep = await pergunta('Digite o CEP da pessoa: ');
                        logradouro = await pergunta('Digite o nome da rua da pessoa: ');
                        numeroResidencial = await pergunta('Digite o número residêncial da pessoa: ');
                        ddd = await pergunta('Digite o DDD do número de telefone da pessoa: ');
                        telefone = await pergunta('Digite o número de telefone da pessoa: ');
                        email = await pergunta('Digite o endereço de e-mail da pessoa: ');

                        pessoa = {
                            cpf: cpf,
                            nome: nome,
                            sobrenome: sobrenome,
                            data_nascimento: data_nascimento,
                            id_cidade: idCidade,
                            bairro: bairro,
                            cep: cep,
                            logradouro: logradouro,
                            numero_residencial: numeroResidencial,
                            ddd: ddd,
                            telefone: telefone,
                            email: email
                        };

                        await Pessoa.create(pessoa);
                        break;
                    case '2':
                    pessoas = await Pessoa.getAll();

                        for (const pessoa of pessoas) {

                            for (const chave in pessoa) {

                                console.log(`${chave}: ${pessoa[chave]}`);
                            }

                            console.log('\n');
                        }
                        break;
                    case '3':
                        id = await pergunta('Digite o ID da pessoa: ');

                        pessoa = await Pessoa.getOne(id);

                        for (const chave in pessoa) {

                            console.log(`${chave}: ${pessoa[chave]}`);
                        }
                        break;
                    case '4':
                        id = await pergunta('Digite o ID da pessoa: ');
                        cpf = await pergunta('Digite o CPF da pessoa: ');
                        nome = await pergunta('Digite o nome da pessoa: ');
                        sobrenome = await pergunta('Digite o sobrenome da pessoa: ');
                        data_nascimento = await pergunta('Digite a data de nascimento da pessoa: ');
                        idCidade = await pergunta('Digite o ID da cidade da pessoa: ');
                        bairro = await pergunta('Digite o bairro da pessoa: ');
                        cep = await pergunta('Digite o CEP da pessoa: ');
                        logradouro = await pergunta('Digite o nome da rua da pessoa: ');
                        numeroResidencial = await pergunta('Digite o número residêncial da pessoa: ');
                        ddd = await pergunta('Digite o DDD do número de telefone da pessoa: ');
                        telefone = await pergunta('Digite o número de telefone da pessoa: ');
                        email = await pergunta('Digite o endereço de e-mail da pessoa: ');

                        pessoa = {
                            cpf: cpf,
                            nome: nome,
                            sobrenome: sobrenome,
                            data_nascimento: data_nascimento,
                            id_cidade: idCidade,
                            bairro: bairro,
                            cep: cep,
                            logradouro: logradouro,
                            numero_residencial: numeroResidencial,
                            ddd: ddd,
                            telefone: telefone,
                            email: email
                        };

                        await Pessoa.update(id, pessoa);
                        break;
                    case '5':
                        id = await pergunta('Digite o ID da pessoa: ');

                        await Pessoa.delete(id);
                        break;
                    case '6':
                        break;
                    default:
                        console.log('Opção inválida');
                        break;
                }
                break;
            case '4':
                opcaoExecutar = await pergunta(menuExecucao);

                switch (opcaoExecutar) {
                    case '1':
                        id = await pergunta('Digite o ID da pessoa que se tornará solicitante: ');
                        quantidadeDependentes = await pergunta('Digite a quantidade de dependentes: ');

                        solicitante = {
                            id: id,
                            quantidade_dependentes: quantidadeDependentes
                        };

                        await Solicitante.create(solicitante);
                        break;
                    case '2':
                    solicitantes = await Solicitante.getAll();

                        for (const solicitante of solicitantes) {

                            for (const chave in solicitante) {

                                console.log(`${chave}: ${solicitante[chave]}`);
                            }

                            console.log('\n');
                        }
                        break;
                    case '3':
                        id = await pergunta('Digite o ID do solicitante: ');

                        solicitante = await Solicitante.getOne(id);

                        for (const chave in solicitante) {

                            console.log(`${chave}: ${solicitante[chave]}`);
                        }
                        break;
                    case '4':
                        id = await pergunta('Digite o ID do solicitante: ');
                        idPessoa = await pergunta('Digite o ID da pessoa: ');
                        quantidadeDependentes = await pergunta('Digite a quantidade de dependentes: ');

                        solicitante = {
                            quantidade_dependentes: quantidadeDependentes,
                            id: idPessoa
                        };

                        await Solicitante.update(id, solicitante);
                        break;
                    case '5':
                        id = await pergunta('Digite o ID do solicitante: ');

                        await Solicitante.delete(id);
                        break;
                    case '6':
                        break;
                    default:
                        console.log('Opção inválida');
                        break;
                }
                break;
            case '5':
                opcaoExecutar = await pergunta(menuExecucao);

                switch (opcaoExecutar) {
                    case '1':
                        id = await pergunta('Digite o ID da pessoa que se tornará condutor: ');
                        cnh = await pergunta('Digite a CNH do condutor: ');

                        condutor = {
                            id: id,
                            cnh: cnh
                        };

                        await Condutor.create(condutor);
                        break;
                    case '2':
                    condutores = await Condutor.getAll();

                        for (const condutor of condutores) {

                            for (const chave in condutor) {

                                console.log(`${chave}: ${condutor[chave]}`);
                            }

                            console.log('\n');
                        }
                        break;
                    case '3':
                        id = await pergunta('Digite o ID do condutor: ');

                        condutor = await Condutor.getOne(id);

                        for (const chave in condutor) {

                            console.log(`${chave}: ${condutor[chave]}`);
                        }
                        break;
                    case '4':
                        id = await pergunta('Digite o ID do condutor: ');
                        idPessoa = await pergunta('Digite o ID da pessoa: ');
                        cnh = await pergunta('Digite a CNH do condutor: ');

                        condutor = {
                            cnh: cnh,
                            id: idPessoa
                        };

                        await Condutor.update(id, condutor);
                        break;
                    case '5':
                        id = await pergunta('Digite o ID do condutor: ');

                        await Condutor.delete(id);
                        break;
                    case '6':
                        break;
                    default:
                        console.log('Opção inválida');
                        break;
                }
                break;
            case '6':
                opcaoExecutar = await pergunta(menuExecucao);

                switch (opcaoExecutar) {
                    case '1':
                        nome = await pergunta('Digite o nome do depósito: ');
                        descricao = await pergunta('Digite a descrição do depósito: ');
                        idPessoa = await pergunta('Digite o ID da pessoa associada ao depósito: ');

                        deposito = {
                            nome: nome,
                            descricao,
                            id_pessoa: idPessoa
                        };

                        await Deposito.create(deposito);
                        break;
                    case '2':
                    depositos = await Deposito.getAll();

                        for (const deposito of depositos) {

                            for (const chave in deposito) {

                                console.log(`${chave}: ${deposito[chave]}`);
                            }

                            console.log('\n');
                        }
                        break;
                    case '3':
                        id = await pergunta('Digite o ID do depósito: ');

                        deposito = await  Deposito.getOne(id);

                        for (const chave in deposito) {

                            console.log(`${chave}: ${deposito[chave]}`);
                        }
                        break;
                    case '4':
                        id = await pergunta('Digite o ID do depósito: ');
                        nome = await pergunta('Digite o nome do depósito: ');
                        descricao = await pergunta('Digite a descrição do depósito: ');
                        idPessoa = await pergunta('Digite o ID da pessoa associada ao depósito: ');

                        deposito = {
                            nome: nome,
                            descricao: descricao,
                            id_pessoa: idPessoa
                        };

                        await Deposito.update(id, deposito);
                        break;
                    case '5':
                        id = await pergunta('Digite o ID do depósito: ');

                        await Deposito.delete(id);
                        break;
                    case '6':
                        break;
                    default:
                        console.log('Opção inválida');
                        break;
                }
                break;
            case '7':
                opcaoExecutar = await pergunta(menuExecucao);

                switch (opcaoExecutar) {
                    case '1':
                        nome = await pergunta('Digite o nome do alimento: ');
                        descricao = await pergunta('Digite a descrição do alimento: ');

                        alimento = {
                            nome: nome,
                            descricao: descricao
                        };

                        await Alimento.create(alimento);
                        break;
                    case '2':
                    alimentos = await Alimento.getAll();

                        for (const alimento of alimentos) {

                            for (const chave in alimento) {

                                console.log(`${chave}: ${alimento[chave]}`);
                            }

                            console.log('\n');
                        }
                        break;
                    case '3':
                        id = await pergunta('Digite o ID do alimento: ');

                        alimento = await Alimento.getOne(id);

                        for (const chave in alimento) {

                            console.log(`${chave}: ${alimento[chave]}`);
                        }
                        break;
                    case '4':
                        id = await pergunta('Digite o ID do alimento: ');
                        nome = await pergunta('Digite o nome do alimento: ');
                        descricao = await pergunta('Digite a descrição do alimento: ');

                        alimento = {
                            nome: nome,
                            descricao: descricao
                        };

                        await Alimento.update(id, alimento);
                        break;
                    case '5':
                        id = await pergunta('Digite o ID do alimento: ');

                        await Alimento.delete(id);
                        break;
                    case '6':
                        break;
                    default:
                        console.log('Opção inválida');
                        break;
                }
                break;
            case '8':
                opcaoExecutar = await pergunta(menuExecucao);

                switch (opcaoExecutar) {
                    case '1':
                        idAlimento = await pergunta('Digite o ID do alimento: ');
                        dataValidade = await pergunta('Digite a data de validade desse alimento: ');
                        peso = await pergunta('Digite o peso desse alimento: ');
                        idCondutor = await pergunta('Digite o ID do condutor que buscou esse alimento: ');
                        idPessoa = await pergunta('Digite o ID da pessoa que doou esse alimento: ');
                        idDeposito = await pergunta('Digite o ID do depósito onde esse alimento será armazenado: ');

                        arrecadacaoAlimento = {
                            id_alimento: idAlimento,
                            data_validade: dataValidade,
                            peso: peso,
                            id_condutor: idCondutor,
                            id_pessoa: idPessoa,
                            id_deposito: idDeposito
                        };

                        await ArrecadacaoAlimento.create(arrecadacaoAlimento);
                        break;
                    case '2':
                    arrecadacoesAlimento = await ArrecadacaoAlimento.getAll();

                        for (const arrecadacaoAlimento of arrecadacoesAlimento) {

                            for (const chave in arrecadacaoAlimento) {

                                console.log(`${chave}: ${arrecadacaoAlimento[chave]}`);
                            }

                            console.log('\n');
                        }
                        break;
                    case '3':
                        id = await pergunta('Digite o ID da arrecadação de alimentos: ');

                        arrecadacaoAlimento = await ArrecadacaoAlimento.getOne(id);

                        for (const chave in arrecadacaoAlimento) {

                            console.log(`${chave}: ${arrecadacaoAlimento[chave]}`);
                        }
                        break;
                    case '4':
                        id = await pergunta('Digite o ID da arrecadação de alimentos: ');
                        idAlimento = await pergunta('Digite o ID do alimento: ');
                        dataValidade = await pergunta('Digite a data de validade desse alimento: ');
                        peso = await pergunta('Digite o peso desse alimento: ');
                        idCondutor = await pergunta('Digite o ID do condutor que buscou esse alimento: ');
                        idPessoa = await pergunta('Digite o ID da pessoa que doou esse alimento: ');
                        idDeposito = await pergunta('Digite o ID do depósito onde esse alimento será armazenado: ');

                        arrecadacaoAlimento = {
                            id_alimento: idAlimento,
                            data_validade: dataValidade,
                            peso: peso,
                            id_condutor: idCondutor,
                            id_pessoa: idPessoa,
                            id_deposito: idDeposito
                        };

                        await ArrecadacaoAlimento.update(id, arrecadacaoAlimento);
                        break;
                    case '5':
                        id = await pergunta('Digite o ID da arrecadação de alimentos: ');

                        await ArrecadacaoAlimento.delete(id);
                        break;
                    case '6':
                        break;
                    default:
                        console.log('Opção inválida');
                        break;
                }
                break;
            case '9':
                opcaoExecutar = await pergunta(menuExecucao);

                switch (opcaoExecutar) {
                    case '1':
                        idAlimento = await pergunta('Digite o ID do alimento: ');
                        dataValidade = await pergunta('Digite a data de validade desse alimento: ');
                        peso = await pergunta('Digite o peso desse alimento: ');
                        idDeposito = await pergunta('Digite o ID do depósito onde esse alimento está armazenado: ');

                        estoqueAlimento = {
                            id_alimento: idAlimento,
                            data_validade: dataValidade,
                            peso: peso,
                            id_deposito: idDeposito
                        };

                        await EstoqueAlimento.create(estoqueAlimento);
                        break;
                    case '2':
                    estoquesAlimento = await EstoqueAlimento.getAll();

                        for (const estoqueAlimento of estoquesAlimento) {

                            for (const chave in estoqueAlimento) {

                                console.log(`${chave}: ${estoqueAlimento[chave]}`);
                            }

                            console.log('\n');
                        }
                        break;
                    case '3':
                        id = await pergunta('Digite o ID do estoque: ');

                        estoqueAlimento = await EstoqueAlimento.getOne(id);

                        for (const chave in estoqueAlimento) {

                            console.log(`${chave}: ${estoqueAlimento[chave]}`);
                        }
                        break;
                    case '4':
                        id = await pergunta('Digite o ID do estoque: ');
                        idAlimento = await pergunta('Digite o ID do alimento: ');
                        dataValidade = await pergunta('Digite a data de validade desse alimento: ');
                        peso = await pergunta('Digite o peso desse alimento: ');
                        idDeposito = await pergunta('Digite o ID do depósito onde esse alimento está armazenado: ');

                        estoqueAlimento = {
                            id_alimento: idAlimento,
                            data_validade: dataValidade,
                            peso: peso,
                            id_deposito: idDeposito
                        };

                        await EstoqueAlimento.update(id, estoqueAlimento);
                        break;
                    case '5':
                        id = await pergunta('Digite o ID do estoque: ');

                        await EstoqueAlimento.delete(id);
                        break;
                    case '6':
                        break;
                    default:
                        console.log('Opção inválida');
                        break;
                }
                break;
            case '10':
                opcaoExecutar = await pergunta(menuExecucao);

                switch (opcaoExecutar) {
                    case '1':
                        idAlimento = await pergunta('Digite o ID do alimento: ');
                        idSolicitante = await pergunta('Digite o ID do solicitante que receberá a doação: ');
                        peso = await pergunta('Digite o peso desse alimento: ');
                        idCondutor = await pergunta('Digite o ID do condutor que buscou esse alimento: ');
                        idEstoqueAlimento = await pergunta('Digite o ID do estoque: ');

                        doacaoAlimento = {
                            id_alimento: idAlimento,
                            id_solicitante: idSolicitante,
                            peso: peso,
                            id_condutor: idCondutor,
                            id_estoque_alimento: idEstoqueAlimento
                        };

                        await DoacaoAlimento.create(doacaoAlimento);
                        break;
                    case '2':
                    doacoesAlimento = await DoacaoAlimento.getAll();

                        for (const doacaoAlimento of doacoesAlimento) {

                            for (const chave in doacaoAlimento) {

                                console.log(`${chave}: ${doacaoAlimento[chave]}`);
                            }

                            console.log('\n');
                        }
                        break;
                    case '3':
                        id = await pergunta('Digite o ID da doação de alimentos: ');

                        doacaoAlimento = await DoacaoAlimento.getOne(id);

                        for (const chave in doacaoAlimento) {

                            console.log(`${chave}: ${doacaoAlimento[chave]}`);
                        }
                        break;
                    case '4':
                        id = await pergunta('Digite o ID da doação de alimentos: ');
                        idAlimento = await pergunta('Digite o ID do alimento: ');
                        idSolicitante = await pergunta('Digite o ID do solicitante que receberá a doação: ');
                        peso = await pergunta('Digite o peso desse alimento: ');
                        idCondutor = await pergunta('Digite o ID do condutor que buscou esse alimento: ');
                        idEstoqueAlimento = await pergunta('Digite o ID do estoque: ');

                        doacaoAlimento = {
                            id_alimento: idAlimento,
                            id_solicitante: idSolicitante,
                            peso: peso,
                            id_condutor: idCondutor,
                            id_estoque_alimento: idEstoqueAlimento
                        };

                        await DoacaoAlimento.update(id, doacaoAlimento);
                        break;
                    case '5':
                        id = await pergunta('Digite o ID da doação de alimentos: ');

                        await DoacaoAlimento.delete(id);
                        break;
                    case '6':
                        break;
                    default:
                        console.log('Opção inválida');
                        break;
                }
                break;
            case '11':
                resultados = await Deposito.pegarPessoasAssociadasAosDepositosESuasCidades();

                for (const resultado of resultados) {

                    for (const chave in resultado) {

                        console.log(`${chave}: ${resultado[chave]}`);
                    }

                    console.log('\n');
                }
                break;
            case '12':
                resultados = await ArrecadacaoAlimento.pegarTotalArrecadadoPorAlimento();

                for (const resultado of resultados) {

                    for (const chave in resultado) {

                        console.log(`${chave}: ${resultado[chave]}`);
                    }

                    console.log('\n');
                }
                break;
            case '13':
                resultados = await DoacaoAlimento.pegarTotalDoacoesPorSolicitante();

                for (const resultado of resultados) {

                    for (const chave in resultado) {

                        console.log(`${chave}: ${resultado[chave]}`);
                    }

                    console.log('\n');
                }
                break;
            case '14':
                console.log('\nObrigado por acessar! Até mais!');
                break;
            default:
                console.log('Opção inválida');
                break;
        }
    } while (opcaoInicial !== '14');
    rl.close();
})();
