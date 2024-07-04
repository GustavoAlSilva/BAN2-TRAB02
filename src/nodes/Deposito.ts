import driver from '../config/database';
import { DepositoCreateType, DepositoUpdateType } from '../types/depositoTypes';

export default class Deposito {

    static async getAll() {

        const session = driver.session();

        try {

            const result = await session.run(
                `
                MATCH (d:Deposito)
                RETURN id(d) AS id, d
                `
            );

            return result.records.map(record => {

                const warehouse = record.get('d').properties;
                const warehouseId = record.get('id');

                return { id: warehouseId, ...warehouse };
            });
        } catch (error) {

            console.error('Erro ao buscar depósitos:', error);

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
                MATCH (d:Deposito)
                WHERE id(d) = $id
                RETURN id(d) AS id, d
                `,
                { id: parseInt(id) }
            );

            if (result.records.length === 0) {

                throw new Error('Depósito não encontrado');
            }

            const record = result.records[0];
            const warehouse = record.get('d').properties;
            const warehouseId = record.get('id');

            return { id: warehouseId, ...warehouse };
        } catch (error) {

            console.error('Erro ao buscar depósito:', error);

            throw error;
        } finally {

            await session.close();
        }
    }

    static async create(data: DepositoCreateType) {

        const session = driver.session();

        try {

            await session.run(
                `
                MATCH (p:Pessoa)
                WHERE id(p) = $id_pessoa
                CREATE (d:Deposito {
                    nome: $nome,
                    descricao: $descricao
                })
                MERGE (d)-[:DISPONIBILIZADO_POR]->(p)
                RETURN id(d) AS id, d
                `,
                { nome: data.nome, descricao: data.descricao, id_pessoa: parseInt(data.id_pessoa) }
            );
        } catch (error) {

            console.error('Erro ao criar depósito:', error);

            throw error;
        } finally {

            await session.close();
        }
    }

    static async update(id: string, data: DepositoUpdateType) {

        const session = driver.session();

        try {

            await session.run(
                `
                MATCH (d:Deposito)-[rel:DISPONIBILIZADO_POR]->(pAntiga:Pessoa)
                WHERE id(d) = $id
                MATCH (pNova:Pessoa) WHERE id(pNova) = $id_pessoa
                SET d.nome = $nome,
                    d.descricao = $descricao
                DELETE rel
                MERGE (d)-[:DISPONIBILIZADO_POR]->(pNova)
                RETURN id(d) AS id, d, pNova
                `,
                { id: parseInt(id), nome: data.nome, descricao: data.descricao, id_pessoa: parseInt(data.id_pessoa) }
            );
        } catch (error) {

            console.error('Erro ao atualizar depósito:', error);

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
                MATCH (d:Deposito)-[r]->()
                WHERE id(d) = $id
                DELETE r, d
                `,
                { id: parseInt(id) }
            );

            if (result.summary.counters.updates().nodesDeleted === 0) {

                throw new Error('Depósito não encontrado');
            }
        } catch (error) {

            console.error('Erro ao deletar depósito:', error);

            throw error;
        } finally {

            await session.close();
        }
    }

    static async pegarPessoasAssociadasAosDepositosESuasCidades() {

        const session = driver.session();

        try {

            const result = await session.run(`
                MATCH (d:Deposito)-[:DISPONIBILIZADO_POR]->(p:Pessoa)-[:RESIDE_EM]->(c:Cidade)
                RETURN id(d) AS idDeposito,
                       d.nome AS nomeDeposito,
                       p.nome AS nomePessoa,
                       c.nome AS nomeCidade
            `);

            return result.records.map(record => ({
                idDeposito: record.get('idDeposito'),
                nomeDeposito: record.get('nomeDeposito'),
                nomePessoa: record.get('nomePessoa'),
                nomeCidade: record.get('nomeCidade')
            }));
        } catch (error) {

            console.error('Erro ao buscar pessoas associadas aos depósitos e suas cidades:', error);

            throw error;
        } finally {

            await session.close();
        }
    }
}
