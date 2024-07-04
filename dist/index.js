"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const readline_1 = __importDefault(require("readline"));
const Estado_1 = __importDefault(require("./src/nodes/Estado"));
const Cidade_1 = __importDefault(require("./src/nodes/Cidade"));
const Pessoa_1 = __importDefault(require("./src/nodes/Pessoa"));
const Solicitante_1 = __importDefault(require("./src/nodes/Solicitante"));
const Condutor_1 = __importDefault(require("./src/nodes/Condutor"));
const Deposito_1 = __importDefault(require("./src/nodes/Deposito"));
const Alimento_1 = __importDefault(require("./src/nodes/Alimento"));
const ArrecadacaoAlimento_1 = __importDefault(require("./src/nodes/ArrecadacaoAlimento"));
const EstoqueAlimento_1 = __importDefault(require("./src/nodes/EstoqueAlimento"));
const DoacaoAlimento_1 = __importDefault(require("./src/nodes/DoacaoAlimento"));
const rl = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout,
});
function pergunta(entrada) {
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
(() => __awaiter(void 0, void 0, void 0, function* () {
    let opcaoInicial;
    do {
        opcaoInicial = yield pergunta(menuInicial);
        switch (opcaoInicial) {
            case '1':
                opcaoExecutar = yield pergunta(menuExecucao);
                switch (opcaoExecutar) {
                    case '1':
                        uf = yield pergunta('Digite a UF do estado: ');
                        nome = yield pergunta('Digite o nome do estado: ');
                        estado = {
                            uf: uf,
                            nome: nome
                        };
                        yield Estado_1.default.create(estado);
                        break;
                    case '2':
                        const estados = yield Estado_1.default.getAll();
                        for (const estado of estados) {
                            for (const chave in estado) {
                                console.log(`${chave}: ${estado[chave]}`);
                            }
                            console.log('\n');
                        }
                        break;
                    case '3':
                        uf = yield pergunta('Digite a UF do estado: ');
                        estado = yield Estado_1.default.getOne(uf);
                        for (const chave in estado) {
                            console.log(`${chave}: ${estado[chave]}`);
                        }
                        break;
                    case '4':
                        uf = yield pergunta('Digite a UF do estado: ');
                        nome = yield pergunta('Digite o nome do estado: ');
                        estado = { nome: nome };
                        yield Estado_1.default.update(uf, estado);
                        break;
                    case '5':
                        uf = yield pergunta('Digite a UF do estado: ');
                        yield Estado_1.default.delete(uf);
                        break;
                    case '6':
                        break;
                    default:
                        console.log('Opção inválida');
                        break;
                }
                break;
            case '2':
                opcaoExecutar = yield pergunta(menuExecucao);
                switch (opcaoExecutar) {
                    case '1':
                        ufEstado = yield pergunta('Digite a UF do estado da cidade: ');
                        nome = yield pergunta('Digite o nome da cidade: ');
                        cidade = {
                            estadoUf: ufEstado,
                            nome: nome
                        };
                        yield Cidade_1.default.create(cidade);
                        break;
                    case '2':
                        cidades = yield Cidade_1.default.getAll();
                        for (const cidade of cidades) {
                            for (const chave in cidade) {
                                console.log(`${chave}: ${cidade[chave]}`);
                            }
                            console.log('\n');
                        }
                        break;
                    case '3':
                        id = yield pergunta('Digite o ID da cidade: ');
                        cidade = yield Cidade_1.default.getOne(id);
                        for (const chave in cidade) {
                            console.log(`${chave}: ${cidade[chave]}`);
                        }
                        break;
                    case '4':
                        id = yield pergunta('Digite o ID da cidade: ');
                        ufEstado = yield pergunta('Digite a UF do estado da cidade: ');
                        nome = yield pergunta('Digite o nome da cidade: ');
                        cidade = { nome: nome, estadoUf: ufEstado };
                        yield Cidade_1.default.update(id, cidade);
                        break;
                    case '5':
                        id = yield pergunta('Digite o ID da cidade: ');
                        yield Cidade_1.default.delete(id);
                        break;
                    case '6':
                        break;
                    default:
                        console.log('Opção inválida');
                        break;
                }
                break;
            case '3':
                opcaoExecutar = yield pergunta(menuExecucao);
                switch (opcaoExecutar) {
                    case '1':
                        cpf = yield pergunta('Digite o CPF da pessoa: ');
                        nome = yield pergunta('Digite o nome da pessoa: ');
                        sobrenome = yield pergunta('Digite o sobrenome da pessoa: ');
                        data_nascimento = yield pergunta('Digite a data de nascimento da pessoa: ');
                        idCidade = yield pergunta('Digite o ID da cidade da pessoa: ');
                        bairro = yield pergunta('Digite o bairro da pessoa: ');
                        cep = yield pergunta('Digite o CEP da pessoa: ');
                        logradouro = yield pergunta('Digite o nome da rua da pessoa: ');
                        numeroResidencial = yield pergunta('Digite o número residêncial da pessoa: ');
                        ddd = yield pergunta('Digite o DDD do número de telefone da pessoa: ');
                        telefone = yield pergunta('Digite o número de telefone da pessoa: ');
                        email = yield pergunta('Digite o endereço de e-mail da pessoa: ');
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
                        yield Pessoa_1.default.create(pessoa);
                        break;
                    case '2':
                        pessoas = yield Pessoa_1.default.getAll();
                        for (const pessoa of pessoas) {
                            for (const chave in pessoa) {
                                console.log(`${chave}: ${pessoa[chave]}`);
                            }
                            console.log('\n');
                        }
                        break;
                    case '3':
                        id = yield pergunta('Digite o ID da pessoa: ');
                        pessoa = yield Pessoa_1.default.getOne(id);
                        for (const chave in pessoa) {
                            console.log(`${chave}: ${pessoa[chave]}`);
                        }
                        break;
                    case '4':
                        id = yield pergunta('Digite o ID da pessoa: ');
                        cpf = yield pergunta('Digite o CPF da pessoa: ');
                        nome = yield pergunta('Digite o nome da pessoa: ');
                        sobrenome = yield pergunta('Digite o sobrenome da pessoa: ');
                        data_nascimento = yield pergunta('Digite a data de nascimento da pessoa: ');
                        idCidade = yield pergunta('Digite o ID da cidade da pessoa: ');
                        bairro = yield pergunta('Digite o bairro da pessoa: ');
                        cep = yield pergunta('Digite o CEP da pessoa: ');
                        logradouro = yield pergunta('Digite o nome da rua da pessoa: ');
                        numeroResidencial = yield pergunta('Digite o número residêncial da pessoa: ');
                        ddd = yield pergunta('Digite o DDD do número de telefone da pessoa: ');
                        telefone = yield pergunta('Digite o número de telefone da pessoa: ');
                        email = yield pergunta('Digite o endereço de e-mail da pessoa: ');
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
                        yield Pessoa_1.default.update(id, pessoa);
                        break;
                    case '5':
                        id = yield pergunta('Digite o ID da pessoa: ');
                        yield Pessoa_1.default.delete(id);
                        break;
                    case '6':
                        break;
                    default:
                        console.log('Opção inválida');
                        break;
                }
                break;
            case '4':
                opcaoExecutar = yield pergunta(menuExecucao);
                switch (opcaoExecutar) {
                    case '1':
                        id = yield pergunta('Digite o ID da pessoa que se tornará solicitante: ');
                        quantidadeDependentes = yield pergunta('Digite a quantidade de dependentes: ');
                        solicitante = {
                            id: id,
                            quantidade_dependentes: quantidadeDependentes
                        };
                        yield Solicitante_1.default.create(solicitante);
                        break;
                    case '2':
                        solicitantes = yield Solicitante_1.default.getAll();
                        for (const solicitante of solicitantes) {
                            for (const chave in solicitante) {
                                console.log(`${chave}: ${solicitante[chave]}`);
                            }
                            console.log('\n');
                        }
                        break;
                    case '3':
                        id = yield pergunta('Digite o ID do solicitante: ');
                        solicitante = yield Solicitante_1.default.getOne(id);
                        for (const chave in solicitante) {
                            console.log(`${chave}: ${solicitante[chave]}`);
                        }
                        break;
                    case '4':
                        id = yield pergunta('Digite o ID do solicitante: ');
                        idPessoa = yield pergunta('Digite o ID da pessoa: ');
                        quantidadeDependentes = yield pergunta('Digite a quantidade de dependentes: ');
                        solicitante = {
                            quantidade_dependentes: quantidadeDependentes,
                            id: idPessoa
                        };
                        yield Solicitante_1.default.update(id, solicitante);
                        break;
                    case '5':
                        id = yield pergunta('Digite o ID do solicitante: ');
                        yield Solicitante_1.default.delete(id);
                        break;
                    case '6':
                        break;
                    default:
                        console.log('Opção inválida');
                        break;
                }
                break;
            case '5':
                opcaoExecutar = yield pergunta(menuExecucao);
                switch (opcaoExecutar) {
                    case '1':
                        id = yield pergunta('Digite o ID da pessoa que se tornará condutor: ');
                        cnh = yield pergunta('Digite a CNH do condutor: ');
                        condutor = {
                            id: id,
                            cnh: cnh
                        };
                        yield Condutor_1.default.create(condutor);
                        break;
                    case '2':
                        condutores = yield Condutor_1.default.getAll();
                        for (const condutor of condutores) {
                            for (const chave in condutor) {
                                console.log(`${chave}: ${condutor[chave]}`);
                            }
                            console.log('\n');
                        }
                        break;
                    case '3':
                        id = yield pergunta('Digite o ID do condutor: ');
                        condutor = yield Condutor_1.default.getOne(id);
                        for (const chave in condutor) {
                            console.log(`${chave}: ${condutor[chave]}`);
                        }
                        break;
                    case '4':
                        id = yield pergunta('Digite o ID do condutor: ');
                        idPessoa = yield pergunta('Digite o ID da pessoa: ');
                        cnh = yield pergunta('Digite a CNH do condutor: ');
                        condutor = {
                            cnh: cnh,
                            id: idPessoa
                        };
                        yield Condutor_1.default.update(id, condutor);
                        break;
                    case '5':
                        id = yield pergunta('Digite o ID do condutor: ');
                        yield Condutor_1.default.delete(id);
                        break;
                    case '6':
                        break;
                    default:
                        console.log('Opção inválida');
                        break;
                }
                break;
            case '6':
                opcaoExecutar = yield pergunta(menuExecucao);
                switch (opcaoExecutar) {
                    case '1':
                        nome = yield pergunta('Digite o nome do depósito: ');
                        descricao = yield pergunta('Digite a descrição do depósito: ');
                        idPessoa = yield pergunta('Digite o ID da pessoa associada ao depósito: ');
                        deposito = {
                            nome: nome,
                            descricao,
                            id_pessoa: idPessoa
                        };
                        yield Deposito_1.default.create(deposito);
                        break;
                    case '2':
                        depositos = yield Deposito_1.default.getAll();
                        for (const deposito of depositos) {
                            for (const chave in deposito) {
                                console.log(`${chave}: ${deposito[chave]}`);
                            }
                            console.log('\n');
                        }
                        break;
                    case '3':
                        id = yield pergunta('Digite o ID do depósito: ');
                        deposito = yield Deposito_1.default.getOne(id);
                        for (const chave in deposito) {
                            console.log(`${chave}: ${deposito[chave]}`);
                        }
                        break;
                    case '4':
                        id = yield pergunta('Digite o ID do depósito: ');
                        nome = yield pergunta('Digite o nome do depósito: ');
                        descricao = yield pergunta('Digite a descrição do depósito: ');
                        idPessoa = yield pergunta('Digite o ID da pessoa associada ao depósito: ');
                        deposito = {
                            nome: nome,
                            descricao: descricao,
                            id_pessoa: idPessoa
                        };
                        yield Deposito_1.default.update(id, deposito);
                        break;
                    case '5':
                        id = yield pergunta('Digite o ID do depósito: ');
                        yield Deposito_1.default.delete(id);
                        break;
                    case '6':
                        break;
                    default:
                        console.log('Opção inválida');
                        break;
                }
                break;
            case '7':
                opcaoExecutar = yield pergunta(menuExecucao);
                switch (opcaoExecutar) {
                    case '1':
                        nome = yield pergunta('Digite o nome do alimento: ');
                        descricao = yield pergunta('Digite a descrição do alimento: ');
                        alimento = {
                            nome: nome,
                            descricao: descricao
                        };
                        yield Alimento_1.default.create(alimento);
                        break;
                    case '2':
                        alimentos = yield Alimento_1.default.getAll();
                        for (const alimento of alimentos) {
                            for (const chave in alimento) {
                                console.log(`${chave}: ${alimento[chave]}`);
                            }
                            console.log('\n');
                        }
                        break;
                    case '3':
                        id = yield pergunta('Digite o ID do alimento: ');
                        alimento = yield Alimento_1.default.getOne(id);
                        for (const chave in alimento) {
                            console.log(`${chave}: ${alimento[chave]}`);
                        }
                        break;
                    case '4':
                        id = yield pergunta('Digite o ID do alimento: ');
                        nome = yield pergunta('Digite o nome do alimento: ');
                        descricao = yield pergunta('Digite a descrição do alimento: ');
                        alimento = {
                            nome: nome,
                            descricao: descricao
                        };
                        yield Alimento_1.default.update(id, alimento);
                        break;
                    case '5':
                        id = yield pergunta('Digite o ID do alimento: ');
                        yield Alimento_1.default.delete(id);
                        break;
                    case '6':
                        break;
                    default:
                        console.log('Opção inválida');
                        break;
                }
                break;
            case '8':
                opcaoExecutar = yield pergunta(menuExecucao);
                switch (opcaoExecutar) {
                    case '1':
                        idAlimento = yield pergunta('Digite o ID do alimento: ');
                        dataValidade = yield pergunta('Digite a data de validade desse alimento: ');
                        peso = yield pergunta('Digite o peso desse alimento: ');
                        idCondutor = yield pergunta('Digite o ID do condutor que buscou esse alimento: ');
                        idPessoa = yield pergunta('Digite o ID da pessoa que doou esse alimento: ');
                        idDeposito = yield pergunta('Digite o ID do depósito onde esse alimento será armazenado: ');
                        arrecadacaoAlimento = {
                            id_alimento: idAlimento,
                            data_validade: dataValidade,
                            peso: peso,
                            id_condutor: idCondutor,
                            id_pessoa: idPessoa,
                            id_deposito: idDeposito
                        };
                        yield ArrecadacaoAlimento_1.default.create(arrecadacaoAlimento);
                        break;
                    case '2':
                        arrecadacoesAlimento = yield ArrecadacaoAlimento_1.default.getAll();
                        for (const arrecadacaoAlimento of arrecadacoesAlimento) {
                            for (const chave in arrecadacaoAlimento) {
                                console.log(`${chave}: ${arrecadacaoAlimento[chave]}`);
                            }
                            console.log('\n');
                        }
                        break;
                    case '3':
                        id = yield pergunta('Digite o ID da arrecadação de alimentos: ');
                        arrecadacaoAlimento = yield ArrecadacaoAlimento_1.default.getOne(id);
                        for (const chave in arrecadacaoAlimento) {
                            console.log(`${chave}: ${arrecadacaoAlimento[chave]}`);
                        }
                        break;
                    case '4':
                        id = yield pergunta('Digite o ID da arrecadação de alimentos: ');
                        idAlimento = yield pergunta('Digite o ID do alimento: ');
                        dataValidade = yield pergunta('Digite a data de validade desse alimento: ');
                        peso = yield pergunta('Digite o peso desse alimento: ');
                        idCondutor = yield pergunta('Digite o ID do condutor que buscou esse alimento: ');
                        idPessoa = yield pergunta('Digite o ID da pessoa que doou esse alimento: ');
                        idDeposito = yield pergunta('Digite o ID do depósito onde esse alimento será armazenado: ');
                        arrecadacaoAlimento = {
                            id_alimento: idAlimento,
                            data_validade: dataValidade,
                            peso: peso,
                            id_condutor: idCondutor,
                            id_pessoa: idPessoa,
                            id_deposito: idDeposito
                        };
                        yield ArrecadacaoAlimento_1.default.update(id, arrecadacaoAlimento);
                        break;
                    case '5':
                        id = yield pergunta('Digite o ID da arrecadação de alimentos: ');
                        yield ArrecadacaoAlimento_1.default.delete(id);
                        break;
                    case '6':
                        break;
                    default:
                        console.log('Opção inválida');
                        break;
                }
                break;
            case '9':
                opcaoExecutar = yield pergunta(menuExecucao);
                switch (opcaoExecutar) {
                    case '1':
                        idAlimento = yield pergunta('Digite o ID do alimento: ');
                        dataValidade = yield pergunta('Digite a data de validade desse alimento: ');
                        peso = yield pergunta('Digite o peso desse alimento: ');
                        idDeposito = yield pergunta('Digite o ID do depósito onde esse alimento está armazenado: ');
                        estoqueAlimento = {
                            id_alimento: idAlimento,
                            data_validade: dataValidade,
                            peso: peso,
                            id_deposito: idDeposito
                        };
                        yield EstoqueAlimento_1.default.create(estoqueAlimento);
                        break;
                    case '2':
                        estoquesAlimento = yield EstoqueAlimento_1.default.getAll();
                        for (const estoqueAlimento of estoquesAlimento) {
                            for (const chave in estoqueAlimento) {
                                console.log(`${chave}: ${estoqueAlimento[chave]}`);
                            }
                            console.log('\n');
                        }
                        break;
                    case '3':
                        id = yield pergunta('Digite o ID do estoque: ');
                        estoqueAlimento = yield EstoqueAlimento_1.default.getOne(id);
                        for (const chave in estoqueAlimento) {
                            console.log(`${chave}: ${estoqueAlimento[chave]}`);
                        }
                        break;
                    case '4':
                        id = yield pergunta('Digite o ID do estoque: ');
                        idAlimento = yield pergunta('Digite o ID do alimento: ');
                        dataValidade = yield pergunta('Digite a data de validade desse alimento: ');
                        peso = yield pergunta('Digite o peso desse alimento: ');
                        idDeposito = yield pergunta('Digite o ID do depósito onde esse alimento está armazenado: ');
                        estoqueAlimento = {
                            id_alimento: idAlimento,
                            data_validade: dataValidade,
                            peso: peso,
                            id_deposito: idDeposito
                        };
                        yield EstoqueAlimento_1.default.update(id, estoqueAlimento);
                        break;
                    case '5':
                        id = yield pergunta('Digite o ID do estoque: ');
                        yield EstoqueAlimento_1.default.delete(id);
                        break;
                    case '6':
                        break;
                    default:
                        console.log('Opção inválida');
                        break;
                }
                break;
            case '10':
                opcaoExecutar = yield pergunta(menuExecucao);
                switch (opcaoExecutar) {
                    case '1':
                        idAlimento = yield pergunta('Digite o ID do alimento: ');
                        idSolicitante = yield pergunta('Digite o ID do solicitante que receberá a doação: ');
                        peso = yield pergunta('Digite o peso desse alimento: ');
                        idCondutor = yield pergunta('Digite o ID do condutor que buscou esse alimento: ');
                        idEstoqueAlimento = yield pergunta('Digite o ID do estoque: ');
                        doacaoAlimento = {
                            id_alimento: idAlimento,
                            id_solicitante: idSolicitante,
                            peso: peso,
                            id_condutor: idCondutor,
                            id_estoque_alimento: idEstoqueAlimento
                        };
                        yield DoacaoAlimento_1.default.create(doacaoAlimento);
                        break;
                    case '2':
                        doacoesAlimento = yield DoacaoAlimento_1.default.getAll();
                        for (const doacaoAlimento of doacoesAlimento) {
                            for (const chave in doacaoAlimento) {
                                console.log(`${chave}: ${doacaoAlimento[chave]}`);
                            }
                            console.log('\n');
                        }
                        break;
                    case '3':
                        id = yield pergunta('Digite o ID da doação de alimentos: ');
                        doacaoAlimento = yield DoacaoAlimento_1.default.getOne(id);
                        for (const chave in doacaoAlimento) {
                            console.log(`${chave}: ${doacaoAlimento[chave]}`);
                        }
                        break;
                    case '4':
                        id = yield pergunta('Digite o ID da doação de alimentos: ');
                        idAlimento = yield pergunta('Digite o ID do alimento: ');
                        idSolicitante = yield pergunta('Digite o ID do solicitante que receberá a doação: ');
                        peso = yield pergunta('Digite o peso desse alimento: ');
                        idCondutor = yield pergunta('Digite o ID do condutor que buscou esse alimento: ');
                        idEstoqueAlimento = yield pergunta('Digite o ID do estoque: ');
                        doacaoAlimento = {
                            id_alimento: idAlimento,
                            id_solicitante: idSolicitante,
                            peso: peso,
                            id_condutor: idCondutor,
                            id_estoque_alimento: idEstoqueAlimento
                        };
                        yield DoacaoAlimento_1.default.update(id, doacaoAlimento);
                        break;
                    case '5':
                        id = yield pergunta('Digite o ID da doação de alimentos: ');
                        yield DoacaoAlimento_1.default.delete(id);
                        break;
                    case '6':
                        break;
                    default:
                        console.log('Opção inválida');
                        break;
                }
                break;
            case '11':
                resultados = yield Deposito_1.default.pegarPessoasAssociadasAosDepositosESuasCidades();
                for (const resultado of resultados) {
                    for (const chave in resultado) {
                        console.log(`${chave}: ${resultado[chave]}`);
                    }
                    console.log('\n');
                }
                break;
            case '12':
                resultados = yield ArrecadacaoAlimento_1.default.pegarTotalArrecadadoPorAlimento();
                for (const resultado of resultados) {
                    for (const chave in resultado) {
                        console.log(`${chave}: ${resultado[chave]}`);
                    }
                    console.log('\n');
                }
                break;
            case '13':
                resultados = yield DoacaoAlimento_1.default.pegarTotalDoacoesPorSolicitante();
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
}))();
