import { TransactionRepository } from '../data/repositories/TransactionRepository';
import { AuthRepository } from '../data/repositories/AuthRepository';
import { DashboardRepository } from '../data/repositories/DashboardRepository';
import { TransactionUseCases } from '../../domain/usecases/TransactionUseCases';
import { AuthUseCases } from '../../domain/usecases/AuthUseCases';
import { DashboardUseCases } from '../../domain/usecases/DashboardUseCases';

// Repositórios (agora com cache integrado)
const transactionRepository = new TransactionRepository();
const authRepository = new AuthRepository();
const dashboardRepository = new DashboardRepository();

// Use Cases
export const transactionUseCases = new TransactionUseCases(transactionRepository);
export const authUseCases = new AuthUseCases(authRepository);
export const dashboardUseCases = new DashboardUseCases(dashboardRepository);

