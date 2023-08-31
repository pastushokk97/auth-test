import { DataSource, EntityManager, QueryRunner } from 'typeorm';

export type TUseTransaction = {
  manager: EntityManager;
  queryRunner: QueryRunner;
  isInner?: boolean;
};

export async function useTransaction(
  transactionHandler: DataSource | EntityManager,
): Promise<TUseTransaction> {
  if (transactionHandler instanceof EntityManager) {
    return {
      manager: transactionHandler,
      queryRunner: transactionHandler.queryRunner,
      isInner: false,
    };
  }

  const queryRunner = transactionHandler.createQueryRunner();
  await queryRunner.startTransaction();

  return {
    manager: queryRunner.manager,
    queryRunner,
    isInner: true,
  };
}

export async function useCommitTransaction({
  isInner,
  manager,
}: TUseTransaction): Promise<void> {
  if (isInner) return manager.queryRunner.commitTransaction();
}

export async function useRollbackTransaction({
  isInner,
  manager,
}: TUseTransaction): Promise<void> {
  if (isInner && manager.queryRunner.isTransactionActive)
    return manager.queryRunner.rollbackTransaction();
}

export async function useReleaseTransaction({
  isInner,
  manager,
}: TUseTransaction): Promise<void> {
  if (isInner && !manager.queryRunner.isReleased)
    return manager.queryRunner.release();
}
