import api from "./axios";
import type { Source, CreateSourceDto, UpdateSourceDto } from "../types";

export const getSources = async (): Promise<Source[]> => {
  const { data } = await api.get<Source[]>("/sources");
  return data;
};

export const createSource = async (
  sourceData: CreateSourceDto
): Promise<Source> => {
  const { data } = await api.post<Source>("/sources", sourceData);
  return data;
};

export const deleteSource = async (id: string): Promise<void> => {
  await api.delete(`/sources/${id}`);
};

export const updateSource = async (
  id: string,
  sourceData: Partial<UpdateSourceDto>
): Promise<Source> => {
  const { data } = await api.patch<Source>(`/sources/${id}`, sourceData);
  return data;
};
