export interface XxxDTO {
  id: string;
  name: string;
  remark?: string;
}

export const useXxxApi = createSharedComposable(() => {
  const { get, post } = useAxios();

  const getXxxList = get<MgListResponse<XxxDTO>>("/xxx/list");

  const createXxx = (data: XxxDTO) =>
    post<MgDataResponse<XxxDTO>>("/xxx/create", data);

  return { getXxxList };
});
