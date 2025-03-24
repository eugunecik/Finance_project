import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { SearchService } from './search.service';
import { JwtAuthGuard } from '../../guards/jwt-guard';

@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async search(@Query('q') searchTerm: string, @Request() req) {
    return this.searchService.searchReceipts(searchTerm, req.user.userId);
  }
}