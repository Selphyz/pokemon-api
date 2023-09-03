import { PartialType } from '@nestjs/mapped-types';
import { PokemonDto } from './pokemon.dto';

export class UpdatePokemonDto extends PartialType(PokemonDto) {}
