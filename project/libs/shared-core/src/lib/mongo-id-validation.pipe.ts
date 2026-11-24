import { BadRequestException, Injectable } from '@nestjs/common';
import type { PipeTransform } from '@nestjs/common';
import { isMongoId } from 'class-validator';

@Injectable()
export class MongoIdValidationPipe implements PipeTransform<string, string> {
  transform(value: string) {
    if (!isMongoId(value)) {
      throw new BadRequestException('Некорректный MongoDB ID');
    }
    return value;
  }
}
