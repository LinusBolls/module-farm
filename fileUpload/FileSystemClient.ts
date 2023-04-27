import { Request } from 'express';
import multer from 'multer';
import { PrismaClient } from '@prisma/client';

enum FileRole {
  AVATAR = 'AVATAR',
  WORKFLOW_INPUT = 'WORKFLOW_INPUT',
  WORKFLOW_THUMBNAIL = 'WORKFLOW_THUMBNAIL',
  ICON = 'ICON',
}

interface FileMetadata {
  filename: string;
  filetype: string;
  roles: FileRole[];
}

class FileUploader {
  private storage: multer.StorageEngine;
  // @ts-ignore
  private upload: multer.Instance;
  private prisma: PrismaClient;

  constructor() {
    this.storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, 'uploads/');
      },
      filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
      },
    });

    this.upload = multer({ storage: this.storage });

    this.prisma = new PrismaClient();
  }

  public async saveFiles(req: Request): Promise<FileMetadata[]> {
    const files = await this.uploadFiles(req);
    const fileMetadata = this.getFileMetadata(files);
    await this.saveFileMetadata(fileMetadata);
    return fileMetadata;
  }

  private async uploadFiles(req: Request): Promise<multer.File[]> {
    return new Promise((resolve, reject) => {
      this.upload.array('files')(req, null, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(req.files as multer.File[]);
        }
      });
    });
  }

  private getFileMetadata(files: multer.File[]): FileMetadata[] {
    return files.map((file) => ({
      filename: file.filename,
      filetype: file.mimetype,
      roles: this.getFileRoles(file.fieldname),
    }));
  }

  private getFileRoles(fieldname: string): FileRole[] {
    switch (fieldname) {
      case 'avatar':
        return [FileRole.AVATAR];
      case 'workflow_input':
        return [FileRole.WORKFLOW_INPUT];
      case 'workflow_thumbnail':
        return [FileRole.WORKFLOW_THUMBNAIL];
      case 'icon':
        return [FileRole.ICON];
      default:
        return [];
    }
  }

  private async saveFileMetadata(fileMetadata: FileMetadata[]): Promise<void> {
    const fileRecords = fileMetadata.map((metadata) => ({
      filename: metadata.filename,
      filetype: metadata.filetype,
    }));

    await this.prisma.file.createMany({
      data: fileRecords,
    });

    const fileIdMap = await this.getFileIdMap(fileRecords);

    const fileRoleRecords = fileMetadata.flatMap((metadata) =>
      metadata.roles.map((role) => ({
        fileId: fileIdMap[metadata.filename],
        role,
      }))
    );

    await this.prisma.fileRole.createMany({
      data: fileRoleRecords,
    });
  }

  private async getFileIdMap(fileRecords: { filename: string; filetype: string }[]): Promise<Record<string, number>> {
    const files = await this.prisma.file.findMany({
      where: {
        filename: { in: fileRecords.map((record) => record.filename) },
      },
      select: {
        id: true,
        filename: true,
      },
    });

    return files.reduce((acc, file) => {
      acc[file.filename] = file.id;
      return acc;
    }, {} as Record<string, number>);
  }
}
export default FileUploader