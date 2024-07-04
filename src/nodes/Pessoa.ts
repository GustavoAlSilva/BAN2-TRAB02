import driver from '../config/database';
import { PessoaCreateType, PessoaUpdateType } from '../types/pessoaTypes';

export default class Pessoa {

    static async getAll() {

        const session = driver.session();

        try {

            const result = await session.run(
                `
                MATCH (p:Pessoa)
                RETURN id(p) AS id, p
                `
            );

            return result.records.map(record => {

                const person = record.get('p').properties;
                const personId = record.get('id');

                return { id: personId, ...person };
            });
        } catch (error) {

            console.error('Erro ao buscar pessoas:', error);

            throw error;
        } finally {

            await session.close();
        }
    }

    static async getOne(id: string) {

        const session = driver.session();

        try {

            const result = await session.run(
                `
                MATCH (p:Pessoa)
                WHERE id(p) = $id
                RETURN id(p) AS id, p
                `,
                { id: parseInt(id) }
            );

            if (result.records.length === 0) {

                throw new Error('Pessoa não encontrada');
            }

            const record = result.records[0];
            const person = record.get('p').properties;
            const personId = record.get('id');

            return { id: personId, ...person };
        } catch (error) {

            console.error('Erro ao buscar pessoa:', error);

            throw error;
        } finally {

            await session.close();
        }
    }

    static async create(data: PessoaCreateType) {

        console.log(data);

        const session = driver.session();

        try {

            await session.run(
                `
                MATCH (c:Cidade)
                WHERE id(c) = $id_cidade
                MERGE (p:Pessoa {cpf: $cpf})
                ON CREATE SET
                    p.nome = $nome,
                    p.sobrenome = $sobrenome,
                    p.data_nascimento = $data_nascimento,
                    p.bairro = $bairro,
                    p.cep = $cep,
                    p.logradouro = $logradouro,
                    p.numero_residencial = $numero_residencial,
                    p.ddd = $ddd,
                    p.telefone = $telefone,
                    p.email = $email
                MERGE (p)-[:RESIDE_EM]->(c)
                RETURN id(p) AS id, p
                `,
                {
                    cpf: data.cpf,
                    nome: data.nome,
                    sobrenome: data.sobrenome,
                    data_nascimento: data.data_nascimento,
                    id_cidade: parseInt(data.id_cidade),
                    bairro: data.bairro,
                    cep: data.cep,
                    logradouro: data.logradouro,
                    numero_residencial: data.numero_residencial,
                    ddd: data.ddd,
                    telefone: data.telefone,
                    email: data.email
                }
            );
        } catch (error) {

            console.error('Erro ao criar pessoa:', error);

            throw error;
        } finally {

            await session.close();
        }
    }

    static async update(id: string, data: PessoaUpdateType) {

        const session = driver.session();

        try {

            await session.run(
                `
                MATCH (p:Pessoa)-[rel:RESIDE_EM]->(cAntiga:Cidade)
                WHERE id(p) = $id
                MATCH (cNova:Cidade) WHERE id(cNova) = $id_cidade
                SET p.cpf = $cpf,
                    p.nome = $nome,
                    p.sobrenome = $sobrenome,
                    p.data_nascimento = $data_nascimento,
                    p.bairro = $bairro,
                    p.cep = $cep,
                    p.logradouro = $logradouro,
                    p.numero_residencial = $numero_residencial,
                    p.ddd = $ddd,
                    p.telefone = $telefone,
                    p.email = $email
                DELETE rel
                MERGE (p)-[:RESIDE_EM]->(cNova)
                RETURN id(p) AS id, p, cNova
                `,
                {
                    id: parseInt(id),
                    cpf: data.cpf,
                    nome: data.nome,
                    sobrenome: data.sobrenome,
                    data_nascimento: data.data_nascimento,
                    id_cidade: parseInt(data.id_cidade),
                    bairro: data.bairro,
                    cep: data.cep,
                    logradouro: data.logradouro,
                    numero_residencial: data.numero_residencial,
                    ddd: data.ddd,
                    telefone: data.telefone,
                    email: data.email
                }
            );
        } catch (error) {

            console.error('Erro ao atualizar pessoa:', error);

            throw error;
        } finally {

            await session.close();
        }
    }

    static async delete(id: string) {

        const session = driver.session();

        try {

            const result = await session.run(
                `
                MATCH (p:Pessoa)-[r]->()
                WHERE id(p) = $id
                DELETE r, p
                `,
                { id: parseInt(id) }
            );

            if (result.summary.counters.updates().nodesDeleted === 0) {

                throw new Error('Pessoa não encontrada');
            }
        } catch (error) {

            console.error('Erro ao deletar pessoa:', error);

            throw error;
        } finally {

            await session.close();
        }
    }
}
