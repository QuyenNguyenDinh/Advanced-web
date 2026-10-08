import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';

@Injectable()
export class DestinationsService {
  constructor(private readonly db: DatabaseService) {}

  async findAll(search?: string, featured?: string) {
    try {
      let queryText = 'SELECT * FROM destinations';
      const queryParams: any[] = [];

      if (featured !== undefined && featured !== null) {
        queryParams.push(featured === 'true');
        queryText += ` WHERE is_featured = $${queryParams.length}`;
      }

      if (search) {
        const searchClause = ` (name ILIKE $${queryParams.length + 1} OR description ILIKE $${queryParams.length + 1})`;
        queryText += (queryParams.length > 0 ? ' AND' : ' WHERE') + searchClause;
        queryParams.push(`%${search}%`);
      }

      queryText += ' ORDER BY id DESC';

      const result = await this.db.query(queryText, queryParams);

      return {
        success: true,
        total: result.rowCount,
        data: result.rows,
      };
    } catch (error: any) {
      console.error('Error fetching destinations:', error);
      throw new InternalServerErrorException({
        success: false,
        message: 'Lỗi máy chủ khi lấy danh sách điểm đến',
        error: error.message,
      });
    }
  }

  async findOne(id: number) {
    try {
      const destResult = await this.db.query(
        'SELECT * FROM destinations WHERE id = $1',
        [id],
      );

      if (destResult.rows.length === 0) {
        throw new NotFoundException({
          success: false,
          message: `Không tìm thấy điểm đến với ID = ${id}`,
        });
      }

      const destination = destResult.rows[0];

      const placesResult = await this.db.query(
        'SELECT * FROM places WHERE destination_id = $1 ORDER BY avg_rating DESC',
        [id],
      );

      destination.places = placesResult.rows;

      return {
        success: true,
        data: destination,
      };
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      console.error('Error fetching destination by id:', error);
      throw new InternalServerErrorException({
        success: false,
        message: 'Lỗi máy chủ khi lấy chi tiết điểm đến',
        error: error.message,
      });
    }
  }

  async create(dto: CreateDestinationDto) {
    const {
      slug,
      name,
      description,
      cover_image,
      best_months,
      difficulty,
      how_to_get_there,
      warnings,
      avg_budget,
      is_featured,
    } = dto;

    if (!slug || !name || !description) {
      throw new BadRequestException({
        success: false,
        message: 'Vui lòng cung cấp đầy đủ: slug, name, description',
      });
    }

    try {
      const insertQuery = `
        INSERT INTO destinations (
          slug, name, description, cover_image, best_months,
          difficulty, how_to_get_there, warnings, avg_budget, is_featured
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `;

      const values = [
        slug,
        name,
        description,
        cover_image || null,
        best_months || null,
        difficulty || 'Trung bình',
        how_to_get_there || null,
        warnings || null,
        avg_budget || null,
        is_featured === true || is_featured === 'true',
      ];

      const result = await this.db.query(insertQuery, values);

      return {
        success: true,
        message: 'Thêm điểm đến mới thành công!',
        data: result.rows[0],
      };
    } catch (error: any) {
      console.error('Error creating destination:', error);
      if (error.code === '23505') {
        throw new BadRequestException({
          success: false,
          message: 'Slug điểm đến đã tồn tại. Vui lòng chọn slug khác.',
        });
      }
      throw new InternalServerErrorException({
        success: false,
        message: 'Lỗi máy chủ khi tạo điểm đến mới',
        error: error.message,
      });
    }
  }

  async update(id: number, dto: UpdateDestinationDto) {
    try {
      const checkExist = await this.db.query(
        'SELECT * FROM destinations WHERE id = $1',
        [id],
      );
      if (checkExist.rows.length === 0) {
        throw new NotFoundException({
          success: false,
          message: `Không tìm thấy điểm đến có ID = ${id} để cập nhật`,
        });
      }

      const {
        slug,
        name,
        description,
        cover_image,
        best_months,
        difficulty,
        how_to_get_there,
        warnings,
        avg_budget,
        is_featured,
      } = dto;

      const updateQuery = `
        UPDATE destinations SET
          slug = COALESCE($1, slug),
          name = COALESCE($2, name),
          description = COALESCE($3, description),
          cover_image = COALESCE($4, cover_image),
          best_months = COALESCE($5, best_months),
          difficulty = COALESCE($6, difficulty),
          how_to_get_there = COALESCE($7, how_to_get_there),
          warnings = COALESCE($8, warnings),
          avg_budget = COALESCE($9, avg_budget),
          is_featured = COALESCE($10, is_featured)
        WHERE id = $11
        RETURNING *
      `;

      const values = [
        slug !== undefined ? slug : null,
        name !== undefined ? name : null,
        description !== undefined ? description : null,
        cover_image !== undefined ? cover_image : null,
        best_months !== undefined ? best_months : null,
        difficulty !== undefined ? difficulty : null,
        how_to_get_there !== undefined ? how_to_get_there : null,
        warnings !== undefined ? warnings : null,
        avg_budget !== undefined ? avg_budget : null,
        is_featured !== undefined ? (is_featured === true || is_featured === 'true') : null,
        id,
      ];

      const result = await this.db.query(updateQuery, values);

      return {
        success: true,
        message: 'Cập nhật điểm đến thành công!',
        data: result.rows[0],
      };
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      console.error('Error updating destination:', error);
      throw new InternalServerErrorException({
        success: false,
        message: 'Lỗi máy chủ khi cập nhật điểm đến',
        error: error.message,
      });
    }
  }

  async remove(id: number) {
    try {
      const result = await this.db.query(
        'DELETE FROM destinations WHERE id = $1 RETURNING *',
        [id],
      );

      if (result.rows.length === 0) {
        throw new NotFoundException({
          success: false,
          message: `Không tìm thấy điểm đến có ID = ${id} để xóa`,
        });
      }

      return {
        success: true,
        message: `Xóa thành công điểm đến: ${result.rows[0].name}`,
        data: result.rows[0],
      };
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      console.error('Error deleting destination:', error);
      throw new InternalServerErrorException({
        success: false,
        message: 'Lỗi máy chủ khi xóa điểm đến',
        error: error.message,
      });
    }
  }
}
