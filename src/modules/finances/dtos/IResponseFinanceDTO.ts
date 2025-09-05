import IUserResponseDTO from 'src/modules/users/dtos/IResponseUserDTO';

export default interface IResponseFinanceDTO {
  id: string;
  user_id: string;
  valor: number;
  descricao: string;
  is_deleted: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  user?: IUserResponseDTO;
}
