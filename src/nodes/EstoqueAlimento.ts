import driver from '../config/database';
import { EstoqueAlimentoCreateType, EstoqueAlimentoUpdateType } from '../types/estoqueAlimentoTypes';

export default class EstoqueAlimento {

    static async getAll() {

        const session = driver.session();

        try {

            const result = await session.run(
                `
                MATCH (e:EstoqueAlimento)
                RETURN id(e) AS id, e
                `
            );

            return result.records.map(record => {

                const foodStock = record.get('e').properties;
                const foodStockId = record.get('id');

                return { id: foodStockId, ...foodStock };
            });
        } catch (error) {

            console.error('Erro ao buscar estoques de alimento:', error);

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
                MATCH (e:EstoqueAlimento)
                WHERE id(e) = $id
                RETURN id(e) AS id, e
                `,
                { id: parseInt(id) }
            );

            if (result.records.length === 0) {

                throw new Error('Estoque de alimento não encontrado');
            }

            const record = result.records[0];
            const foodStock = record.get('e').properties;
            const foodStockId = record.get('id');

            return { id: foodStockId, ...foodStock };
        } catch (error) {

            console.error('Erro ao buscar estoque de alimento:', error);

            throw error;
        } finally {

            await session.close();
        }
    }

    static async create(data: EstoqueAlimentoCreateType) {

        const session = driver.session();

        try {

            await session.run(
                `
                MATCH (a:Alimento)
                WHERE id(a) = $id_alimento
                MATCH (d:Deposito)
                WHERE id(d) = $id_deposito
                CREATE (e:EstoqueAlimento {
                    data_validade: $data_validade,
                    peso: $peso
                })
                MERGE (e)-[:ESTOQUE_DO_ALIMENTO]->(a)
                MERGE (e)-[:ESTÁ_NO_DEPÓSITO]->(d)
                RETURN id(e) AS id, e
                `,
                {
                    id_alimento: parseInt(data.id_alimento),
                    data_validade: data.data_validade,
                    peso: data.peso,
                    id_deposito: parseInt(data.id_deposito)
                }
            );
        } catch (error) {

            console.error('Erro ao criar estoque de alimento:', error);

            throw error;
        } finally {

            await session.close();
        }
    }

    static async update(id: string, data: EstoqueAlimentoUpdateType) {

        const session = driver.session();

        try {

            await session.run(
                `
                MATCH (e:EstoqueAlimento)-[relAlimento:ESTOQUE_DO_ALIMENTO]->(aAntigo:Alimento)
                WHERE id(e) = $id
                MATCH (e:EstoqueAlimento)-[relDeposito:ESTÁ_NO_DEPÓSITO]->(dAntigo:Deposito)
                WHERE id(e) = $id
                MATCH (aNovo:Alimento) WHERE id(aNovo) = $id_alimento
                MATCH (dNovo:Deposito) WHERE id(dNovo) = $id_deposito
                SET e.data_validade = $data_validade,
                    e.peso = $peso
                DELETE relAlimento
                DELETE relDeposito
                MERGE (e)-[:ESTOQUE_DO_ALIMENTO]->(aNovo)
                MERGE (e)-[:ESTÁ_NO_DEPÓSITO]->(dNovo)
                RETURN id(e) AS id, e, aNovo, dNovo
                `,
                {
                    id: parseInt(id),
                    id_alimento: parseInt(data.id_alimento),
                    data_validade: data.data_validade,
                    peso: data.peso,
                    id_deposito: parseInt(data.id_deposito)
                }
            );
        } catch (error) {

            console.error('Erro ao atualizar estoque de alimento:', error);

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
                MATCH (e:EstoqueAlimento)-[r]->()
                WHERE id(e) = $id
                DELETE r, e
                `,
                { id: parseInt(id) }
            );

            if (result.summary.counters.updates().nodesDeleted === 0) {

                throw new Error('Estoque de alimento não encontrado');
            }
        } catch (error) {

            console.error('Erro ao deletar estoque de alimento:', error);

            throw error;
        } finally {

            await session.close();
        }
    }
}
