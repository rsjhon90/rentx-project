import { IVariablesSendMailDTO } from './dtos/IVariablesSendMailDTO';

export interface IMailProvider {
  sendMail(
    to: string,
    subject: string,
    variables: IVariablesSendMailDTO,
    path: string,
  ): Promise<void>;
}
