import { DataSummary } from '../types';

export interface IShopService {
    getAllUserData(token: string, email: string): Promise<DataSummary>;
    createSampleData(token: string): Promise<void>;
    deleteUserData(email: string): Promise<void>;
}
