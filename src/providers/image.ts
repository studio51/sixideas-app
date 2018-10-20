import { Injectable } from '@angular/core';
import { SixIdeasHTTPService } from '../services/http';

import { Storage } from '@ionic/storage';
import { FileTransfer, FileUploadOptions, FileTransferObject, FileUploadResult } from '@ionic-native/file-transfer';

@Injectable()
export class ImageProvider {
  constructor(
    private http: SixIdeasHTTPService,
    private storage: Storage,
    private transfer: FileTransfer

  ) { }

  public async upload(image: string): Promise<FileUploadResult> {
    const token: string = await this.storage.get('token');
    const fileTransfer: FileTransferObject = this.transfer.create();
    const options: FileUploadOptions = {
      fileKey: 'file',
      fileName: 'name.png',
      headers: {
        token: token
      }
    }

    return fileTransfer.upload(image, `${ this.http.url }/uploads`, options);
  }
}
