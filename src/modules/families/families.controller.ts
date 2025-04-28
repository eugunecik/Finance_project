import { Controller, Post, Body, UseGuards, Request, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';
import { FamiliesService } from './families.service';
import { CreateFamilyDto, RequestJoinFamilyDto, ManageJoinRequestDto, FamilyJoinRequestStatusDto } from './dto';
import { JwtAuthGuard } from 'src/guards/jwt-guard';
import { Family } from './models/family.model';
import { User } from '../users/models/user.model';

@ApiTags('Families')
@Controller('families')
export class FamiliesController {
  constructor(private readonly familiesService: FamiliesService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Post('create')
  @ApiOperation({ summary: 'Create a new family' })
  @ApiBody({ type: CreateFamilyDto })
  @ApiResponse({ status: 201, description: 'Family created successfully', type: Family })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createFamily(@Body() dto: CreateFamilyDto, @Request() req): Promise<Family> {
    const userId = req.user?.userId;
    return this.familiesService.createFamily(dto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Post('request-join')
  @ApiOperation({ summary: 'Request to join a family' })
  @ApiBody({ type: RequestJoinFamilyDto })
  @ApiResponse({ status: 200, description: 'Join request sent successfully', type: Family })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async requestJoinFamily(@Body() dto: RequestJoinFamilyDto, @Request() req): Promise<Family> {
    const userId = req.user?.userId;
    return this.familiesService.requestJoinFamily(dto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Post('manage-join-request')
  @ApiOperation({ summary: "Accept or reject a join request for the admin's family" })
  @ApiBody({ type: ManageJoinRequestDto })
  @ApiResponse({ status: 200, description: 'Join request managed successfully', type: Family })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async manageJoinRequest(@Body() dto: ManageJoinRequestDto, @Request() req): Promise<Family> {
    const userId = req.user?.userId;
    return this.familiesService.manageJoinRequest(dto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('my-family')
  @ApiOperation({ summary: 'Get the user’s family' })
  @ApiResponse({ status: 200, description: 'Family retrieved successfully', type: Family })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Family not found' })
  async getUserFamily(@Request() req): Promise<Family | null> {
    const userId = req.user?.userId;
    return this.familiesService.getUserFamily(userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('pending-join-requests')
  @ApiOperation({ summary: "Get all users who requested to join the admin's family" })
  @ApiResponse({ status: 200, description: 'List of users who requested to join', type: [User] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Family not found or user is not admin' })
  async getPendingJoinRequests(@Request() req): Promise<User[]> {
    const userId = req.user?.userId;
    return this.familiesService.getPendingJoinRequests(userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('my-join-requests')
  @ApiOperation({ summary: 'Get all join requests submitted by the user with their statuses' })
  @ApiResponse({ status: 200, description: 'List of join requests with statuses', type: [FamilyJoinRequestStatusDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMyJoinRequests(@Request() req): Promise<FamilyJoinRequestStatusDto[]> {
    const userId = req.user?.userId;
    return this.familiesService.getMyJoinRequests(userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get(':id')
  @ApiOperation({ summary: 'Get family information by ID (accessible to all users)' })
  @ApiParam({ name: 'id', description: 'Family ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Family information retrieved successfully', type: Family })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Family not found' })
  async getFamilyById(@Param('id') id: number): Promise<Family> {
    return this.familiesService.getFamilyByIdForAll(id);
  }
}