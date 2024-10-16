import { NotFoundError } from '../common/errors';
import { Bloq } from '../model/bloq';
import bloqsData from '../../data/bloqs.json';
import { Service } from 'typedi';

@Service()
export class BloqService {
  private bloqs: Bloq[] = bloqsData as Bloq[];

  constructor() {}

  public listBloqs(): Bloq[] {
    return this.bloqs;
  }

  public getBloq(id: string): Bloq {
    const bloq = this.bloqs.find((bloq) => bloq.id === id);
    if (!bloq) throw new NotFoundError('Bloq does not exist');

    return bloq;
  }
}
