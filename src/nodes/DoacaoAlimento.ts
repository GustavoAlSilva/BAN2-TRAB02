import driver from '../config/database';
import { DoacaoAlimentoCreateType, DoacaoAlimentoUpdateType } from '../types/doacaoAlimentoTypes';

export default class DoacaoAlimento {

    static async getAll() {

        const session = driver.session();

        try {

            const result = await session.run(
                `
                MATCH (d:DoacaoAlimento)
                RETURN id(d) AS id, d
                `
            );

            return result.records.map(record => {

                const foodDonation = record.get('d').properties;
                const foodDonationId = record.get('id');

                return { id: foodDonationId, ...foodDonation };
            });
        } catch (error) {

            console.error('Erro ao buscar doações de alimento:', error);

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
                MATCH (d:DoacaoAlimento)
                WHERE id(d) = $id
                RETURN id(d) AS id, d
                `,
                { id: parseInt(id) }
            );

            if (result.records.length === 0) {

                throw new Error('Doação de alimento não encontrada');
            }

            const record = result.records[0];
            const foodDonation = record.get('d').properties;
            const foodDonationId = record.get('id');

            return { id: foodDonationId, ...foodDonation };
        } catch (error) {

            console.error('Erro ao buscar doação de alimento:', error);

            throw error;
        } finally {

            await session.close();
        }
    }

    static async create(data: DoacaoAlimentoCreateType) {

        const session = driver.session();

        try {

            await session.run(
                `
                MATCH (a:Alimento)
                WHERE id(a) = $id_alimento
                MATCH (s:Solicitante)
                WHERE id(s) = $id_solicitante
                MATCH (c:Condutor)
                WHERE id(c) = $id_condutor
                MATCH (e:EstoqueAlimento)
                WHERE id(e) = $id_estoque_alimento
                CREATE (d:DoacaoAlimento {peso: $peso})
                MERGE (d)-[:ALIMENTO_DOADO]->(a)
                MERGE (d)-[:PARA_O_SOLICITANTE]->(s)
                MERGE (d)-[:ENTREGUE_PELO_CONDUTOR]->(c)
                MERGE (d)-[:DO_ESTOQUE]->(e)
                RETURN id(d) AS id, d
                `,
                {
                    id_solicitante: parseInt(data.id_solicitante),
                    id_alimento: parseInt(data.id_alimento),
                    peso: data.peso,
                    id_condutor: parseInt(data.id_condutor),
                    id_estoque_alimento: parseInt(data.id_estoque_alimento)
                }
            );
        } catch (error) {

            console.error('Erro ao criar doação de alimento:', error);

            throw error;
        } finally {

            await session.close();
        }
    }

    static async update(id: string, data: DoacaoAlimentoUpdateType) {

        const session = driver.session();

        try {

            await session.run(
                `
                MATCH (d:DoacaoAlimento)-[relAlimento:ALIMENTO_DOADO]->(aAntigo:Alimento)
                WHERE id(d) = $id
                MATCH (d:DoacaoAlimento)-[relSolicitante:PARA_O_SOLICITANTE]->(sAntigo:Solicitante)
                WHERE id(d) = $id
                MATCH (d:DoacaoAlimento)-[relCondutor:ENTREGUE_PELO_CONDUTOR]->(cAntigo:Condutor)
                WHERE id(d) = $id
                MATCH (d:DoacaoAlimento)-[relEstoqueAlimento:DO_ESTOQUE]->(eAntigo:EstoqueAlimento)
                WHERE id(d) = $id
                MATCH (aNovo:Alimento) WHERE id(aNovo) = $id_alimento
                MATCH (sNovo:Solicitante) WHERE id(sNovo) = $id_solicitante
                MATCH (cNovo:Condutor) WHERE id(cNovo) = $id_condutor
                MATCH (eNovo:EstoqueAlimento) WHERE id(eNovo) = $id_estoque_alimento
                SET d.peso = $peso
                DELETE relAlimento
                DELETE relSolicitante
                DELETE relCondutor
                DELETE relEstoqueAlimento
                MERGE (d)-[:ALIMENTO_DOADO]->(aNovo)
                MERGE (d)-[:PARA_O_SOLICITANTE]->(sNovo)
                MERGE (d)-[:ENTREGUE_PELO_CONDUTOR]->(cNovo)
                MERGE (d)-[:DO_ESTOQUE]->(eNovo)
                RETURN id(d) AS id, d
                `,
                {
                    id: parseInt(id),
                    id_solicitante: parseInt(data.id_solicitante),
                    id_alimento: parseInt(data.id_alimento),
                    peso: data.peso,
                    id_condutor: parseInt(data.id_condutor),
                    id_estoque_alimento: parseInt(data.id_estoque_alimento)
                }
            );
        } catch (error) {

            console.error('Erro ao atualizar doação de alimento:', error);

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
                MATCH (d:DoacaoAlimento)-[r]->()
                WHERE id(d) = $id
                DELETE r, d
                `,
                { id: parseInt(id) }
            );

            if (result.summary.counters.updates().nodesDeleted === 0) {

                throw new Error('Doação de alimento não encontrada');
            }
        } catch (error) {

            console.error('Erro ao deletar doação de alimento:', error);

            throw error;
        } finally {

            await session.close();
        }
    }

    static async pegarTotalDoacoesPorSolicitante() {

        const session = driver.session();

        try {

            const result = await session.run(`
                MATCH (d:DoacaoAlimento)-[:PARA_O_SOLICITANTE]->(s:Solicitante)-[:É_A_PESSOA]->(p:Pessoa)
                WITH s, p, SUM(toFloat(d.peso)) AS totalRecebido
                RETURN id(s) AS idSolicitante,
                    p.nome AS nomeSolicitante,
                    totalRecebido
            `);

            return result.records.map(record => ({
                idSolicitante: record.get('idSolicitante'),
                nomeSolicitante: record.get('nomeSolicitante'),
                totalRecebido: record.get('totalRecebido')
            }));
        } catch (error) {

            console.error('Erro ao obter o total de doações por solicitante:', error);

            throw error;
        } finally {

            await session.close();
        }
    }
}
