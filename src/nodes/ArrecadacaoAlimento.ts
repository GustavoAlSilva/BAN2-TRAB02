import driver from '../config/database';
import { ArrecadacaoAlimentoCreateType, ArrecadacaoAlimentoUpdateType } from '../types/arrecadacaoAlimentoTypes';

export default class ArrecadacaoAlimento {

    static async getAll() {

        const session = driver.session();

        try {

            const result = await session.run(
                `
                MATCH (aa:ArrecadacaoAlimento)
                RETURN id(aa) AS id, aa
                `
            );

            return result.records.map(record => {

                const foodCollection = record.get('aa').properties;
                const foodCollectionId = record.get('id');

                return { id: foodCollectionId, ...foodCollection };
            });
        } catch (error) {

            console.error('Erro ao buscar arrecadações de alimento:', error);

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
                MATCH (aa:ArrecadacaoAlimento)
                WHERE id(aa) = $id
                RETURN id(aa) AS id, aa
                `,
                { id: parseInt(id) }
            );

            if (result.records.length === 0) {

                throw new Error('Arrecadação de alimento não encontrada');
            }

            const record = result.records[0];
            const foodCollection = record.get('aa').properties;
            const foodCollectionId = record.get('id');

            return { id: foodCollectionId, ...foodCollection };
        } catch (error) {

            console.error('Erro ao buscar arrecadação de alimento:', error);

            throw error;
        } finally {

            await session.close();
        }
    }

    static async create(data: ArrecadacaoAlimentoCreateType) {

        const session = driver.session();

        try {

            await session.run(
                `
                MATCH (a:Alimento)
                WHERE id(a) = $id_alimento
                MATCH (p:Pessoa)
                WHERE id(p) = $id_pessoa
                MATCH (c:Condutor)
                WHERE id(c) = $id_condutor
                MATCH (d:Deposito)
                WHERE id(d) = $id_deposito
                CREATE (aa:ArrecadacaoAlimento {
                    peso: $peso,
                    data_validade: $data_validade
                })
                MERGE (aa)-[:ALIMENTO_ARRECADADO]->(a)
                MERGE (aa)-[:PESSOA_QUE_DOOU]->(p)
                MERGE (aa)-[:PEGO_PELO_CONDUTOR]->(c)
                MERGE (aa)-[:ESTÁ_NO_DEPÓSITO]->(d)
                RETURN id(aa) AS id, aa
                `,
                {
                    id_alimento: parseInt(data.id_alimento),
                    data_validade: data.data_validade,
                    peso: data.peso,
                    id_pessoa: parseInt(data.id_pessoa),
                    id_condutor: parseInt(data.id_condutor),
                    id_deposito: parseInt(data.id_deposito)
                }
            );
        } catch (error) {

            console.error('Erro ao criar arrecadação de alimento:', error);

            throw error;
        } finally {

            await session.close();
        }
    }

    static async update(id: string, data: ArrecadacaoAlimentoUpdateType) {

        const session = driver.session();

        try {

            await session.run(
                `
                MATCH (aa:ArrecadacaoAlimento)-[relAlimento:ALIMENTO_ARRECADADO]->(aAntigo:Alimento)
                WHERE id(aa) = $id
                MATCH (aa:ArrecadacaoAlimento)-[relPessoa:PESSOA_QUE_DOOU]->(pAntiga:Pessoa)
                WHERE id(aa) = $id
                MATCH (aa:ArrecadacaoAlimento)-[relCondutor:PEGO_PELO_CONDUTOR]->(cAntigo:Condutor)
                WHERE id(aa) = $id
                MATCH (aa:ArrecadacaoAlimento)-[relDeposito:ESTÁ_NO_DEPÓSITO]->(dAntigo:Deposito)
                WHERE id(aa) = $id
                MATCH (aNovo:Alimento) WHERE id(aNovo) = $id_alimento
                MATCH (pNova:Pessoa) WHERE id(pNova) = $id_pessoa
                MATCH (cNovo:Condutor) WHERE id(cNovo) = $id_condutor
                MATCH (dNovo:Deposito) WHERE id(dNovo) = $id_deposito
                SET aa.peso = $peso, aa.data_validade = $data_validade
                DELETE relAlimento
                DELETE relPessoa
                DELETE relCondutor
                DELETE relDeposito
                MERGE (aa)-[:ALIMENTO_ARRECADADO]->(aNovo)
                MERGE (aa)-[:PESSOA_QUE_DOOU]->(pNova)
                MERGE (aa)-[:PEGO_PELO_CONDUTOR]->(cNovo)
                MERGE (aa)-[:ESTÁ_NO_DEPÓSITO]->(dNovo)
                RETURN id(aa) AS id, aa
                `,
                {
                    id: parseInt(id),
                    id_alimento: parseInt(data.id_alimento),
                    data_validade: data.data_validade,
                    peso: data.peso,
                    id_pessoa: parseInt(data.id_pessoa),
                    id_condutor: parseInt(data.id_condutor),
                    id_deposito: parseInt(data.id_deposito)
                }
            );
        } catch (error) {

            console.error('Erro ao atualizar arrecadação de alimento:', error);

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
                MATCH (aa:ArrecadacaoAlimento)-[r]->()
                WHERE id(aa) = $id
                DELETE r, aa
                `,
                { id: parseInt(id) }
            );

            if (result.summary.counters.updates().nodesDeleted === 0) {

                throw new Error('Arrecadação de alimento não encontrada');
            }
        } catch (error) {

            console.error('Erro ao deletar arrecadação de alimento:', error);

            throw error;
        } finally {

            await session.close();
        }
    }

    static async pegarTotalArrecadadoPorAlimento() {

        const session = driver.session();

        try {

            const result = await session.run(`
                MATCH (aa:ArrecadacaoAlimento)-[:ALIMENTO_ARRECADADO]->(a:Alimento)
                WITH a, SUM(toFloat(aa.peso)) AS pesoTotalArrecadado
                RETURN id(a) AS idAlimento,
                   a.nome AS nomeAlimento,
                   pesoTotalArrecadado
            `);

            return result.records.map(record => ({
                idAlimento: record.get('idAlimento'),
                nomeAlimento: record.get('nomeAlimento'),
                pesoTotalArrecadado: record.get('pesoTotalArrecadado').toNumber()
            }));
        } catch (error) {

            console.error('Erro ao obter o total arrecadado por alimento:', error);

            throw error;
        } finally {

            await session.close();
        }
    }
}
