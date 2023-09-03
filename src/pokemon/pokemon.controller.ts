import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonDto } from './dto/pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Post()
  create(@Body() createPokemonDto: PokemonDto) {
    return this.pokemonService.create(createPokemonDto);
  }

  @Get()
  findAll() {
    return this.pokemonService.findAll();
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.pokemonService.findOne(term);
  }

  @Patch(':term')
  patchPokemon(@Param('term') term: string, @Body() updatePokemonDto: UpdatePokemonDto) {
    return this.pokemonService.updatePatch(term, updatePokemonDto);
  }
  @Put(':term')
  updatePokemon(@Param('term') term: string, @Body() pokemonDto: PokemonDto) {
    return this.pokemonService.updatePut(term, pokemonDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pokemonService.remove(id);
  }
}
