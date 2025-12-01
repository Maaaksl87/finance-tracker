export interface Source {
  _id: string;
  name: string;
  balance: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSourceDto {
  name: string;
  balance: number;
}
