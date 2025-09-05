import { IsString, IsEmail, IsOptional } from 'class-validator';

export default class ICreateUserDTO {
  @IsString()
  nome: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  rua: string;

  @IsString()
  numero: string;

  @IsString()
  bairro: string;

  @IsString()
  @IsOptional()
  complemento?: string;

  @IsString()
  cidade: string;

  @IsString()
  estado: string;

  @IsString()
  cep: string;

  @IsString()
  @IsOptional()
  status?: string;
}
