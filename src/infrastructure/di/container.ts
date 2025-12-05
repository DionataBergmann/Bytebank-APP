import { AuthRepository } from '../data/repositories/AuthRepository';
import { CachedTransactionRepository } from '../cache/CachedTransactionRepository';
import { CachedDashboardRepository } from '../cache/CachedDashboardRepository';
import { TransactionUseCases } from '../../domain/usecases/TransactionUseCases';
import { AuthUseCases } from '../../domain/usecases/AuthUseCases';
import { DashboardUseCases } from '../../domain/usecases/DashboardUseCases';

// Repositórios com cache
const transactionRepository = new CachedTransactionRepository();
const authRepository = new AuthRepository(); // Auth não precisa de cache
const dashboardRepository = new CachedDashboardRepository();

// Use Cases
export const transactionUseCases = new TransactionUseCases(transactionRepository);
export const authUseCases = new AuthUseCases(authRepository);
export const dashboardUseCases = new DashboardUseCases(dashboardRepository);

