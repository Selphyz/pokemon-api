import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { isValidObjectId, Model } from 'mongoose';
import { PokemonDto } from './dto/pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {
  constructor(@InjectModel(Pokemon.name) private readonly pokemonModel: Model<Pokemon>) {}
  async create(createPokemonDto: PokemonDto) {
    try {
      createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
    } catch (error) {
      this.handleExceptions(error);
    }
    return await this.pokemonModel.create(createPokemonDto);
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term: string) {
    let pokemon: Pokemon;
    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: term });
    } else if (isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findOne({ id: term });
    } else {
      pokemon = await this.pokemonModel.findOne({
        name: term.toLowerCase().trim(),
      });
    }
    if (!pokemon) {
      throw new NotFoundException(`No pokemon matches search term: ${term}`);
    }
    return pokemon;
  }

  async updatePatch(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemonToPatch = await this.findOne(term);
    if (updatePokemonDto.name) {
      try {
        updatePokemonDto.name = updatePokemonDto.name.toLowerCase().trim();
      } catch (error) {
        this.handleExceptions(error);
      }
    }
    return { ...pokemonToPatch.toJSON(), ...updatePokemonDto };
  }
  async updatePut(term: string, pokemonDto: PokemonDto) {
    await this.findOne(term);
    if (pokemonDto.name) {
      try {
        pokemonDto.name = pokemonDto.name.toLowerCase().trim();
      } catch (error) {
        this.handleExceptions(error);
      }
    }
    return { pokemonDto };
  }

  async remove(id: string) {
    return this.pokemonModel.findByIdAndDelete(id);
  }
  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(`Existing pokemon in DB ${JSON.stringify(error.keyValue)}`);
    }
    console.log(error);
    throw new InternalServerErrorException(`Can't create pokemon, check server logs`);
  }
}
