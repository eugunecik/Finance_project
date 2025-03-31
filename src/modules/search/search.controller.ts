import { Controller, Get, Query, UseGuards, Request } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from "@nestjs/swagger";
import { SearchService } from "./search.service";
import { JwtAuthGuard } from "../../guards/jwt-guard";

@ApiTags("Search")
@Controller("search")
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get()
  @ApiOperation({ summary: "Search receipts by term" })
  @ApiQuery({
    name: "q",
    description: "Search term to filter receipts",
    example: "SuperStore",
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: "List of matching receipts",
    type: Array,
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async search(@Query("q") searchTerm: string, @Request() req) {
    return this.searchService.searchReceipts(searchTerm, req.user.userId);
  }
}