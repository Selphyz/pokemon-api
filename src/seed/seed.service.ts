import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { Pokedex } from './interfaces/poke-response';
import { async } from 'rxjs';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from '../common/adapters/axios-adapter.interface';

@Injectable()
export class SeedService {
  private readonly axiosIns: AxiosInstance = axios;

  constructor(
    @InjectModel(Pokemon.name) private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter,
  ) {}

  async runSeed() {
    await this.pokemonModel.deleteMany({});
    const pokemonToInsert: { name: string; no: number }[] = [];
    const data = await this.http.get<Pokedex>('https://pokeapi.co/api/v2/pokemon?limit=650');
    data.results.forEach(({ name, url }) => {
      const segments = url.split('/');
      const no = +segments[segments.length - 2];
      pokemonToInsert.push({ name, no });
    });
    await this.pokemonModel.insertMany(pokemonToInsert);
    return data.results;
  }
}
